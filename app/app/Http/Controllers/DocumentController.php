<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentStoreRequest;
use App\Models\AuditLog;
use App\Models\BlockchainTransaction;
use App\Models\Document;
use App\Models\DocumentFile;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use setasign\Fpdi\Fpdi;

class DocumentController extends Controller
{
    public function index()
    {
        Gate::authorize('role', ['arsip']);

        $documents = Document::select([
            'id',
            'document_uuid',
            'document_number',
            'title',
            'document_type',
            'status',
            'metadata',
            'created_by',
        ])
            ->with([
                'blockchainTransaction:id,document_id,tx_hash',
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('documents/index', [
            'documents' => $documents,
        ]);
    }

    public function upload()
    {
        Gate::authorize('role', ['arsip']);

        return Inertia::render('documents/upload');
    }

    public function store(DocumentStoreRequest $request)
    {
        Gate::authorize('role', ['arsip']);

        try {
            DB::transaction(function () use ($request) {

                // dd($request);
                $uploadedFile = $request->file('file');

                $path = $uploadedFile->store(
                    'document/original',
                    'public'
                );

                // dijadikan array
                $metadata = collect($request->metadata)
                    ->pluck('value', 'key')
                    ->toArray();
                ksort($metadata);

                // dd($metadata);

                // data yang diisi manual ketika upload pdf
                $identityData = [
                    'document_number' => $request->document_number,
                    'document_type' => $request->document_type,
                    'issued_date' => $request->issued_date,
                    'metadata' => $metadata,
                ];

                $identityHash = '0x'.hash(
                    'sha256',
                    json_encode(
                        $identityData,
                        JSON_UNESCAPED_UNICODE
                    )
                );

                // file asli pdf
                $fileHash = '0x'.hash_file(
                    'sha256',
                    $uploadedFile->getRealPath()
                );

                $document = Document::create([
                    'document_number' => $request->document_number,
                    'document_uuid' => Str::uuid(),
                    'document_type' => $request->document_type,
                    'title' => $request->title,
                    'issued_date' => $request->issued_date,
                    'metadata' => $request->metadata,
                    'identity_hash' => $identityHash,
                    'file_hash' => $fileHash,
                    'verification_code' => Str::uuid(),
                    'created_by' => Auth::id(),
                    'status' => 'draft',
                ]);

                // dd($path);

                DocumentFile::create([
                    'document_id' => $document->id,
                    'original_file' => $path,
                    'file_size' => $uploadedFile->getSize(),
                ]);
            });
        } catch (\Throwable $e) {
            report($e);

            return back()->withInput()->with('error', 'Gagal mengupload dokumen: '.$e->getMessage());
        }

        return redirect()->route('documents.index')->with('success', 'Dokumen berhasil diUpload');
    }

    public function show($document_uuid)
    {
        Gate::authorize('role', ['arsip']);

        $document = Document::with([
            'creator',
            'file',
            'blockchainTransaction',
            'auditLogs.user',
        ])
            ->where('document_uuid', $document_uuid)
            ->firstOrFail();

        $blockchainStatus = 'not_registered'; // status awal

        // cek di jaringan
        if ($document->blockchainTransaction) {
            try {
                $documentKey = $document->blockchainTransaction->document_key;

                $response = Http::timeout(30)
                    ->withHeaders([
                        'x-api-key' => config('api.blockchain.key'),
                    ])
                    ->get(config('api.blockchain.url').'/documents/'.$documentKey);

                if ($response->status() === 404) {
                    $blockchainStatus = 'not_found';
                } elseif ($response->failed()) {
                    $errorMsg = $response->json('message') ?? 'Error API set-validator';
                    throw new Exception($errorMsg);
                } else {
                    $blockchainStatus = 'valid';
                }

            } catch (Exception $e) {
                Log::error('[Blockchain Verification Error]: '.$e->getMessage());
                $blockchainStatus = 'error';
            }
        }

        // dd($document->toArray());

        return Inertia::render('documents/show', [
            'document' => $document,
            'blockchainStatus' => $blockchainStatus,
        ]);
    }

    public function signAndIssue(Document $document)
    {
        Gate::authorize('role', ['arsip']);

        if ($document->blockchainTransaction && $document->status !== 'draft') {
            return back()->with('error', 'Dokumen ini telah tercatat di Blockchain');
        }

        $payload = [
            'documentNumber' => $document->document_number,
            'identityHash' => $document->identity_hash,
            'fileHash' => $document->file_hash,
            'validatorPrivateKey' => Crypt::decryptString(Auth::user()->wallet->encrypted_private_key),
        ];

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'x-api-key' => config('api.blockchain.key'),
                ])
                ->post(config('api.blockchain.url').'/documents/sign', $payload);

            // dd($response->json());
            if ($response->failed()) {
                $errorMsg = $response->json('message') ?? 'Terjadi kesalahan pada API';

                return back()->withErrors([
                    'api_blockchain_error' => $errorMsg,
                ]);
            }

            $responseData = $response->json();
            $result = $responseData['data'] ?? [];

            $newFilePath = null;
            if (isset($result['documentKey'])) {
                $newFilePath = $this->generateSignedPdfWithQr($document, $result['documentKey']);
                if (! $newFilePath) {
                    return back()->withErrors(['pdf_error' => 'Gagal memproses generate qr code di pdf']);
                }
            }

            DB::transaction(function () use ($document, $result, $newFilePath) {
                BlockchainTransaction::create([
                    'document_id' => $document->id,
                    'tx_hash' => $result['transactionHash'] ?? null,
                    'block_number' => $result['blockNumber'] ?? null,
                    'block_hash' => $result['blockHash'] ?? null,
                    'contract_address' => $result['contractAddress'] ?? null,
                    'document_key' => $result['documentKey'] ?? null,
                    'signer_address' => $result['signerAddress'] ?? null,
                    'gas_used' => $result['gasUsed'] ?? null,
                    'block_timestamp' => isset($result['blockTimestamp'])
                                    ? Carbon::createFromTimestamp($result['blockTimestamp'])
                                    : null,
                    'status' => $result['status'] ?? null,
                ]);

                $document->update(['status' => 'registered']);

                if ($newFilePath) {
                    if ($document->file) {
                        $document->file->update([
                            'verified_file' => $newFilePath,
                        ]);
                    } else {
                        $document->file()->create([
                            'verified_file' => $newFilePath,
                        ]);
                    }
                }

                AuditLog::create([
                    'user_id' => Auth::id(),
                    'document_id' => $document->id,
                    'action' => 'register_blockchain',
                    'payload' => $result,
                ]);
            });

            return back()->with('success', 'Document berhasil di masukan ke Blockhain');

        } catch (Exception $e) {
            report($e);

            $document->update(['status' => 'failed']);

            return back()->with('error', 'Terjadi kesalahan sistem saat menghubungi Blockchain.');
        }
    }

    private function generateSignedPdfWithQr(Document $document, string $documentKey): ?string
    {
        try {
            $qrDir = storage_path('app/public/document/qr');
            $signedDir = storage_path('app/public/document/signed');

            if (! file_exists($qrDir)) {
                mkdir($qrDir, 0755, true);
            }
            if (! file_exists($signedDir)) {
                mkdir($signedDir, 0755, true);
            }

            $qrCodeName = 'qr_'.$document->id.'_'.time().'.png';
            $qrCodePath = $qrDir.'/'.$qrCodeName;
            $verificationUrl = config('app.url').'/verify/qr/'.$documentKey;

            // rendering QR
            $renderer = new ImageRenderer(
                new RendererStyle(150, 1),
                new ImagickImageBackEnd
            );

            $writer = new Writer($renderer);
            $writer->writeFile($verificationUrl, $qrCodePath);

            // konversi 8bit
            $img = imagecreatefrompng($qrCodePath);
            imagepng($img, $qrCodePath);
            imagedestroy($img);

            $cleanedFilePath = ltrim($document->file->original_file, '/');
            $originalPdfPath = storage_path('app/public/'.$cleanedFilePath);

            if (! file_exists($originalPdfPath) || is_dir($originalPdfPath)) {
                Log::error('FPDI Error: File tidak valid. Path yang dicari: '.$originalPdfPath);
                throw new Exception('File PDF asli tidak valid atau tidak ditemukan di path: '.$originalPdfPath);
            }

            $pathInfo = pathinfo($cleanedFilePath);
            $extension = $pathInfo['extension'] ?? 'pdf';

            // signed pdf directory
            $newRelativePath = 'document/signed/'.$pathInfo['filename'].'_signed.'.$extension;
            $newPdfPath = storage_path('app/public/'.$newRelativePath);

            // inject qr ke pdf
            $pdf = new Fpdi;
            $pageCount = $pdf->setSourceFile($originalPdfPath);

            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                $templateId = $pdf->importPage($pageNo);
                $size = $pdf->getTemplateSize($templateId);

                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($templateId);

                if ($pageNo === $pageCount) {
                    $qrWidth = 30;
                    $qrHeight = 30;
                    $margin = 15;

                    $xAxis = $size['width'] - $qrWidth - $margin;
                    $yAxis = $size['height'] - $qrHeight - $margin;

                    $pdf->Image($qrCodePath, $xAxis, $yAxis, $qrWidth, $qrHeight);
                }
            }

            $pdf->Output($newPdfPath, 'F');

            if (file_exists($qrCodePath)) {
                unlink($qrCodePath);
            }

            return $newRelativePath;

        } catch (Exception $e) {
            report($e);

            return null;
        }
    }
}
