<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use function Symfony\Component\Clock\now;

class DocumentController extends Controller
{
    public function index() {
        $documents = Document::with('student')->latest()->get();
       return view('documents.index', compact('documents'));
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'nomor_surat'   => 'required|unique:documents',
            'nim_student'   => 'required|exists:students,nim',
            'perihal'       => 'required',
            'tanggal_surat' => 'required|date',
        ]);

        $nomor_surat = 'DOC-' . strtoupper(Str::random(4)) . '-' . rand(100, 999);
        while (Document::where('nomor_surat', $nomor_surat)->exists()) {
            $nomor_surat = 'DOC-' . strtoupper(Str::random(4)) . '-' . rand(100, 999);
        }

        $dataToSave = array_merge($validated, [
            'nomor_surat' => $nomor_surat,
            'status' => 'pending'
        ]);

        Document::create($dataToSave);

        return redirect()->back()->with('success', 'Draft dokumen berhasil dibuat.');
    }

    public function setujui($id) {
        $document = Document::with('student')->findOrFail($id);

        $documentHash = $this->generateHash($document);

        if ($document->status !== 'pending') {
            return redirect()->back()->with('error', 'Dokumen tidak dalam status siap tanda tangan.');
        }

        try {
            $response =  Http::timeout(30)->post('http://localhost:8001/api/sign-document', [
                'document_id' => $document->id,
                'nomor_surat' => $document->nomor_surat,
                'nim' => $document->nim,
                'name' => $document->student->name,
                'document_hash' => $documentHash,
            ]);

            if ($response->successful()) {
                $result = $response->json();

                $document->update([
                    'document_tx_hash' => $result['tx_hash'],
                    'signer_address' => $result['signer'],
                    'status' => 'signed',
                    'issued_at' => now(),
                ]);

                return redirect()->route('documents.index')->with('success', 'Dokumen Berhasil Ditandatangani secara Digital di Blockchain!');
            }
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Koneksi ke Tasdiqi BE terputus: ' . $e->getMessage());
        }
    }

    private function generateHash($document) {
        $dataToHash = [
            'nomor_surat' => $document->nomor_surat,
            'perihal'     => $document->perihal,
            'tanggal'     => $document->tanggal_surat->format('Y-m-d'),
            'mhs_name'    => $document->student->name,
            'mhs_nim'     => $document->student->nim,
        ];

        return hash('256', json_encode($dataToHash));
    }
}
