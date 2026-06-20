<?php

namespace App\Http\Controllers;

use App\Models\Biro;
use App\Models\Document;
use App\Models\Student;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

use function Symfony\Component\Clock\now;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::with('student')->latest()->get();
        $biros = Biro::where('is_active', true)->get();

        return view('documents.index', compact('documents', 'biros'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nim' => 'required|exists:students,nim',
                'perihal' => 'required',
                'tanggal_surat' => 'required|date',
                'biro_id' => 'required|exists:biros,id',
            ]);

            $student = Student::where('nim', $validated['nim'])->firstOrFail();

            // generate nomor surat
            $nomor_surat = 'DOC-'.strtoupper(Str::random(4)).'-'.rand(100, 999);
            while (Document::where('nomor_surat', $nomor_surat)->exists()) {
                $nomor_surat = 'DOC-'.strtoupper(Str::random(4)).'-'.rand(100, 999);
            }

            Document::create([
                'student_id' => $student->id,
                'biro_id' => $validated['biro_id'],
                'perihal' => $validated['perihal'],
                'tanggal_surat' => $validated['tanggal_surat'],
                'nomor_surat' => $nomor_surat,
                'status' => 'pending',
            ]);

            return redirect()->back()->with('success', 'Draft dokumen berhasil dibuat.');

        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Gagal menyimpan surat: '.$e->getMessage());
        }
    }

    public function setujui($id)
    {
        // dd(request()->method(), request()->fullUrl());
        $document = Document::with(['student', 'biro'])->findOrFail($id);
        // dd($document);

        if (! $document->biro->nama_biro || ! $document->biro->wallet_address) {
            return redirect()->back()->with('error', 'Biro penanda tangan tidak valid.');
        }

        $documentHash = $this->generateHash($document);

        // dd($documentHash);

        if ($document->status !== 'pending') {
            return redirect()->back()->with('error', 'Dokumen tidak dalam status siap tanda tangan.');
        }

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'X-API-Key' => '34rsdf345t2345grfsdsdfv',
                    'Accept' => 'application/json',
                ])
                ->post('http://localhost:8001/api/v1/sign', [
                    // 'document_id' => $document->id,
                    'nomor_surat' => $document->nomor_surat,
                    'nim' => $document->student->nim,
                    // 'name' => $document->student->name,
                    'document_hash' => $documentHash,
                    'biro_slug' => $document->biro->slug,
                ]);

            // dd($response->json());

            if ($response->successful() && $response['success']) {

                $blockchainData = $response->json('data');
                dd($blockchainData);

                if ($blockchainData['status'] === 'Failed') {
                    return redirect()->back()->with('error', 'Validasi gagal: Transaksi di-revert oleh Blockchain Besu.');
                }

                $document->update([
                    'status' => 'signed',
                    'blockchain_tx_hash' => $blockchainData['tx_hash'],
                    'block_number' => $blockchainData['block_number'],
                    'gas_used' => $blockchainData['gas_used'],
                    'signer_address' => $blockchainData['from'],
                    'issued_at' => now(),
                ]);

                return redirect()->route('documents.show')->with('success', 'Dokumen Berhasil Ditandatangani secara Digital di Blockchain!');
            }
        } catch (Exception $e) {
            return redirect()->route('documents.index')->with('error', 'Koneksi ke Tasdiqi BE terputus: '.$e->getMessage());
        }
    }

    public function show($id)
    {
        $document = Document::with(['biro', 'student'])->findOrFail($id);

        return view('documents.show', compact('document'));
    }

    private function generateHash($document)
    {
        $dataToHash = [
            'nomor_surat' => $document->nomor_surat,
            'perihal' => $document->perihal,
            'tanggal' => $document->tanggal_surat->format('Y-m-d'),
            'mhs_name' => $document->student->name,
            'mhs_nim' => $document->student->nim,
        ];

        return hash('sha256', json_encode($dataToHash));
    }
}
