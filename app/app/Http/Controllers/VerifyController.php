<?php

namespace App\Http\Controllers;

use App\Models\BlockchainTransaction;
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
                return Inertia::render('verify/show-qr', [
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

            return Inertia::render('verify/show-qr', [
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

            return Inertia::render('verify/show-qr', [
                'status' => 'SERVER_ERROR',
                'message' => 'Gagal terhubung ke jaringan Blockchain untuk validasi. Silakan coba lagi.',
                'transaction' => $transaction,
                'document' => $document,
            ]);
        }

    }

    // public function verifyUpload($documentKey)
    // {
    //     try {

    //         $response = Http::timeout(30)
    //             ->withHeaders([
    //                 'x-api-key' => config('api.blockchain.key'),
    //             ])
    //             ->get(config('api.blockchain.url').'/documents/', $documentKey);

    //         if ($response->failed()) {
    //             return Inertia::render('verify/result', [
    //                 'status' => 'NOT_FOUND_ON_BLOCKCHAIN',
    //                 'message' => 'Tasdiqi: Dokumen tidak ditemukan atau belum terdaftar di jaringan Blockchain.',
    //             ]);
    //         }

    //         $blockchainData = $response->json('data');

    //         $tx = BlockchainTransaction::with('document.file')
    //             ->where('document_key', $documentKey)
    //             ->first();

    //         if (! $tx || ! $tx->document) {
    //             return Inertia::render('verify/result', [
    //                 'status' => 'NOT_FOUND_ON_BLOCKCHAIN',
    //                 'message' => 'Tasdiqi: Dokumen tidak ditemukan atau belum terdaftar di jaringan Blockchain.',
    //             ]);
    //         }

    //         $document = $tx->document;

    //         // hash ulang metadata
    //         $metadata = collect($document->metadata)
    //             ->pluck('value', 'key')
    //             ->toArray();
    //         ksort($metadata);

    //         $identityData = [
    //             'document_number' => $document->document_number,
    //             'document_type' => $document->document_type,
    //             'issued_date' => $document->issued_date->format('Y-m-d'),
    //             'metadata' => $metadata,
    //         ];

    //     } catch (\Exception $e) {
    //         Log::error('QR Verification Error: '.$e->getMessage());

    //         return view('verification.result', [
    //             'status' => 'FAILED',
    //             'message' => 'Terjadi kesalahan internal sistem saat memverifikasi QR.',
    //         ]);
    //     }
    // }
}
