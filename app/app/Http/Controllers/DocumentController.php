<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentStoreRequest;
use App\Models\AuditLog;
use App\Models\BlockchainTransaction;
use App\Models\Document;
use App\Models\DocumentFile;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
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

    public function upload(Request $request): Response
    {
        return Inertia::render('documents/upload');
    }

    public function store(DocumentStoreRequest $request)
    {
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
        $document = Document::with([
            'creator',
            'file',
            'blockchainTransaction',
            'auditLogs.user',
        ])
            ->where('document_uuid', $document_uuid)
            ->firstOrFail();

        // dd($document->toArray());

        return Inertia::render('documents/show', [
            'document' => $document,
        ]);
    }

    public function sendToBlockchain(Document $document)
    {
        if ($document->blockchainTransaction && $document->status !== 'draft') {
            return back()->with('error', 'Dokumen ini telah tercatat di Blockchain');
        }

        $payload = [
            'documentNumber' => $document->document_number,
            'identityHash' => $document->identity_hash,
            'fileHash' => $document->file_hash,
        ];

        // dd($payload);

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

            DB::transaction(function () use ($document, $result) {
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
}
