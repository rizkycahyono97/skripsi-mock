<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentStoreRequest;
use App\Models\Document;
use App\Models\DocumentFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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

    public function store(DocumentStoreRequest $request)
    {
        // dd($request->toArray());
        DB::transaction(function () use ($request) {

            try {
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

                $identityHash = hash(
                    'sha256',
                    json_encode(
                        $identityData,
                        JSON_UNESCAPED_UNICODE
                    )
                );

                // file asli pdf
                $fileHash = hash_file(
                    'sha256',
                    $uploadedFile->getRealPath()
                );

                $document = Document::create([
                    'document_number' => $request->document_number,
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

                DocumentFile::create([
                    'document_id' => $document->id,
                    'original_file' => $path,
                    'file_size' => $uploadedFile->getSize(),
                ]);
            } catch (\Throwable $e) {
                report($e);

                return back()->withInput()->with('error', 'Gagal mengupload dokumen');
            }

        });

        return redirect()->route('documents.index')->with('success', 'Dokumen berhasil diUpload');
    }
}
