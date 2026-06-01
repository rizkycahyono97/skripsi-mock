<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $documents = Document::select([
            'id',
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

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
        ]);
    }
}
