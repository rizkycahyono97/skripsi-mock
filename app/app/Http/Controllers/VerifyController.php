<?php

namespace App\Http\Controllers;

use App\Models\BlockchainTransaction;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VerifyController extends Controller
{
    /**
     * verify qr, dibandingkan field yang di db dengan yang di blockchain
     */
    public function verifyQr($documentKey)
    {
        $transaction = BlockchainTransaction::with('document.file')
            ->where('document_key', $documentKey)
            ->where('status', 'SUCCESS')
            ->first();

        if (! $transaction || ! $transaction->document) {
            abort(404, 'Dokumen tidak ditemukan atau tidak valid di jaringan blockchain');
        }

        $document = $transaction->document;

        try {
            $blockchainResponse = Http::timeout(15)
                ->withHeaders([
                    'x-api-key' => config('api.blockchain.key'),
                ])
                ->get(config('api.blockchain.url').'/documents/'.$documentKey);

            if ($blockchainResponse->failed()) {
                return Inertia::render('verify/show', [
                    'status' => 'BLOCKCHAIN_NOT_FOUND',
                    'message' => 'Peringatan: Transaksi tercatat lokal, namun tidak ditemukan di Ledger Blockchain.',
                    'transaction' => $transaction,
                    'document' => $document,
                ]);
            }

            $blockchainData = $blockchainResponse->json('data');

            $isDocumentNumberMatch = $document->document_number === $blockchainData['documentNumber'];
            $isIdentityHashMatch = $document->identity_hash === $blockchainData['identityHash'];
            $isFileHashMatch = $document->file_hash === $blockchainData['fileHash'];
            $isSignerMatch = $transaction->signer_address === $blockchainData['signer'];

            if ($isDocumentNumberMatch && $isIdentityHashMatch && $isFileHashMatch && $isSignerMatch) {
                $verificationStatus = 'VALID';
                $message = 'Dokumen 100% Valid dan Terverifikasi Sah oleh Jaringan Blockchain.';
            } else {
                $verificationStatus = 'TAMPERED';
                $message = 'PERINGATAN: Dokumen Tidak Valid! Terdeteksi ketidakcocokan data antara sistem lokal dan Blockchain.';
            }

            $blockExplorerURL = config('blockchain.BLOCK_EXPLORER');

            return Inertia::render('verify/show', [
                'status' => $verificationStatus,
                'message' => $message,
                'transaction' => $transaction,
                'document' => $document,
                'fileUrl' => $document->file ? $document->file->verified_file : null,
                'blockchainData' => $blockchainData,
                'blockExplorer' => $blockExplorerURL,
                'comparison' => [
                    'documentNumber' => $isDocumentNumberMatch,
                    'identityHash' => $isIdentityHashMatch,
                    'fileHash' => $isFileHashMatch,
                    'signer' => $isSignerMatch,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('QR Verification Network Error: '.$e->getMessage());

            return Inertia::render('verify/show', [
                'status' => 'SERVER_ERROR',
                'message' => 'Gagal terhubung ke jaringan Blockchain untuk validasi. Silakan coba lagi.',
                'transaction' => $transaction,
                'document' => $document,
            ]);
        }

    }

    public function verifyUpload()
    {
        return Inertia::render('verify/upload-manual');
    }

    /**
     * verifikasi dengan upload, hash-ulang file upload untuk mencari identity_hash, baru di match dari getDocument
     */
    public function verifyUploadStore(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        try {

            $uploadedFile = $request->file('file');

            $localFileHash = '0x'.hash_file('sha256', $uploadedFile->getRealPath());

            $document = Document::with(['blockchainTransaction', 'file'])
                ->where('file_hash', $localFileHash)
                ->first();

            if (! $document || ! $document->blockchainTransaction) {
                return Inertia::render('verify/show-upload', [
                    'status' => 'NOT_FOUND',
                    'message' => 'Dokumen tidak valid! Berkas sidik jari (hash) tidak terdaftar di sistem kami.',
                    'computedHash' => $localFileHash,
                ]);
            }

            $transaction = $document->blockchainTransaction;
            $documentKey = $transaction->document_key;

            $blockchainResponse = Http::timeout(15)
                ->withHeaders([
                    'x-api-key' => config('api.blockchain.key'),
                ])
                ->get(config('api.blockchain.url').'/documents/'.$documentKey);

            if ($blockchainResponse->failed()) {
                return Inertia::render('verify/show', [
                    'status' => 'BLOCKCHAIN_NOT_FOUND',
                    'message' => 'Peringatan: Transaksi tercatat lokal, namun tidak ditemukan di Ledger Blockchain.',
                    'transaction' => $transaction,
                    'document' => $document,
                ]);
            }

            $blockchainData = $blockchainResponse->json('data');

            $isDocumentNumberMatch = $document->document_number === $blockchainData['documentNumber'];
            $isIdentityHashMatch = $document->identity_hash === $blockchainData['identityHash'];
            $isFileHashMatch = $document->file_hash === $blockchainData['fileHash'];
            $isSignerMatch = $transaction->signer_address === $blockchainData['signer'];

            if ($isDocumentNumberMatch && $isIdentityHashMatch && $isFileHashMatch && $isSignerMatch) {
                $verificationStatus = 'VALID';
                $message = 'Dokumen 100% Valid dan Terverifikasi Sah oleh Jaringan Blockchain.';
            } else {
                $verificationStatus = 'TAMPERED';
                $message = 'PERINGATAN: Dokumen Tidak Valid! Terdeteksi ketidakcocokan data antara sistem lokal dan Blockchain.';
            }

            $blockExplorerURL = config('blockchain.BLOCK_EXPLORER');

            return Inertia::render('verify/show', [
                'status' => $verificationStatus,
                'message' => $message,
                'transaction' => $transaction,
                'document' => $document,
                'fileUrl' => $document->file ? $document->file->verified_file : null,
                'blockchainData' => $blockchainData,
                'blockExplorer' => $blockExplorerURL,
                'comparison' => [
                    'documentNumber' => $isDocumentNumberMatch,
                    'identityHash' => $isIdentityHashMatch,
                    'fileHash' => $isFileHashMatch,
                    'signer' => $isSignerMatch,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Manual Verification Error: '.$e->getMessage());

            return Inertia::render('verify/show', [
                'status' => 'SERVER_ERROR',
                'message' => 'Terjadi kesalahan sistem internal saat memproses verifikasi berkas secara manual.',
            ]);
        }
    }
}
