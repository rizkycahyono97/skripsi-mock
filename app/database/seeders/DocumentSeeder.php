<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\BlockchainTransaction;
use App\Models\Document;
use App\Models\DocumentFile;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $arsipUser = User::where('email', '=', 'arsip@mail.com')->first();

        $documentTypes = ['Ijazah', 'Transkrip Nilai', 'Surat Keterangan Lulus', 'Sertifikat Kompetensi'];
        $statutes = ['Draft', 'Pending', 'Signed', 'Failed'];

        // create dokumen with relation
        for ($i = 0; $i < 25; $i++) {
            $status = $faker->randomElement($statutes);
            $documentType = $faker->randomElement($documentTypes);
            $userName = $faker->name();
            $keperluan = $faker->sentence();

            $document = Document::create([
                'document_number' => 'DOC/ARSIP/'.date('Y').'/'.str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'document_uuid' => Str::uuid(),
                'document_type' => Str::slug($faker->randomElement(($documentTypes))),
                'title' => $documentType.' - '.$userName,
                'issued_date' => $faker->dateTimeBetween('-1 years', 'now')->format('Y-m-d'),
                'metadata' => [
                    'student_name' => $userName,
                    'tentang' => $keperluan,
                    'program_studi' => 'Teknik Informatika',
                    'fakultas' => 'Fakultas Ilmu Komputer',
                ],
                'identity_hash' => hash('sha256', $faker->uuid()),
                'file_hash' => hash('sha256', Str::random(40)),
                'verification_code' => strtoupper(Str::random(10)),
                'created_by' => $arsipUser->id,
                'status' => Str::slug($status),
            ]);

            // generate file dokumen
            DocumentFile::create([
                'document_id' => $document->id,
                'original_file' => 'documents/'.Str::slug($document->student_name).'-original.pdf',
                'verified_file' => in_array($status, ['Signed', 'Published'])
                    ? 'documents/'.Str::slug($document->student_name).'-verified.pdf'
                    : null,
                'file_size' => $faker->numberBetween(1024, 5120),
            ]);

            if (in_array($status, ['Signed'])) {
                BlockchainTransaction::create([
                    'document_id' => $document->id,
                    // Simulasi hash transaksi (seperti di jaringan Ethereum/Besu)
                    'tx_hash' => '0x'.bin2hex(random_bytes(32)),
                    'block_number' => $faker->numberBetween(1000000, 2000000),
                    'contract_address' => '0x'.bin2hex(random_bytes(20)),
                    'signer_address' => '0x'.bin2hex(random_bytes(20)), // Simulasi address wallet Arsip
                    'confirmed_at' => now()->subDays($faker->numberBetween(1, 30)),
                ]);
            }

            AuditLog::create([
                'user_id' => $arsipUser->id,
                'document_id' => $document->id,
                'action' => 'Document Created',
                'payload' => [
                    'ip_address' => $faker->ipv4(),
                    'user_agent' => $faker->userAgent(),
                    'note' => 'Dokumen diunggah dan diinisialisasi ke sistem Arsip.',
                ],
            ]);

            if (in_array($status, ['Signed'])) {
                AuditLog::create([
                    'user_id' => $arsipUser->id,
                    'document_id' => $document->id,
                    'action' => 'Document Signed',
                    'payload' => [
                        'authority' => 'Arsip',
                        'method' => 'EIP-712 Signature',
                        'timestamp' => now()->toIso8601String(),
                    ],
                ]);
            }
        }
    }
}
