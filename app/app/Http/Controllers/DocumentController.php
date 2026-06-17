<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function upload(Request $request): Response
    {
        return Inertia::render('Documents/upload');
    }

    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            // dd($request);
            $uploadedFile = $request->file('file');

            $path = $uploadedFile->store(
                'document/original',
                'public'
            );

            $fileHash = hash_file(
                'sha256',
                $uploadedFile->getRealPath()
            );

            $identifyHash = hash(
                'sha256',
                json_encode(
                    [$request->metadata, $request->document_number],
                    JSON_UNESCAPED_UNICODE
                )
            );

            $identifyHash = hash(
                'sha256',
                json_encode(
                    $request->document_number,
                    JSON_UNESCAPED_UNICODE
                )
            );

            $document = Document::create([
                'document_number' => $request->document_number,
                'document_type' => $request->document_type,
                'title' => $request->title,
                'issued_date' => $request->issued_date,
                'metadata' => $request->metadata,
                'identity_hash' => $identifyHash,
                'file_hash' => $fileHash,
                'verification_code' => Auth::id(),
                'created_by' => Auth::id(),
                'status' => 'draft',
            ]);

            DocumentFile::create([
                'document_id' => $document->id,
                'original_file' => $path,
                'file_size' => $uploadedFile->getSize(),
            ]);
        });

        return redirect()->route('documents.index')->with('success', 'Dokumen berhasil diUpload');
    }
}
