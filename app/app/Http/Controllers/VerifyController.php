<?php

namespace App\Http\Controllers;

use App\Models\BlockchainTransaction;
use Inertia\Inertia;

class VerifyController extends Controller
{
    public function verifyQr($documentKey)
    {
        $transaction = BlockchainTransaction::with('document')
            ->where('document_key', $documentKey)
            ->where('status', 'SUCCESS')
            ->first();

        if (! $transaction) {
            abort(404, 'Dokumen tidak ditemukan atau tidak valid di jaringan blockchain');
        }

        return Inertia::render('verify/show-qr', [
            'transaction' => $transaction,
            'document' => $transaction->document,
            'fileUrl' => $transaction->document->file->verified_file,
        ]);
    }
}
