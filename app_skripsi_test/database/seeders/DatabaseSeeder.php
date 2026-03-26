<?php

namespace Database\Seeders;

use App\Models\Biro;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'test',
            'email' => 'test@example.com',
            'password' => 'test'
        ]);

        Student::create([
            'nim' => '442023611012',
            'name' => 'Rizky Cahyono Putra',
            'prodi' => 'Teknik Informatika',
            'faculty' => 'Saintek',
            'email' => 'rizkycahyonoputra80@student.cs.unida.gontor.ac.id',
        ]);

        $biros = [
            [
                'nama_biro' => 'Biro Akademik',
                'wallet_address' => '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' // 2
            ],
            [
                'nama_biro' => 'Biro Keuangan',
                'wallet_address' => '0x90F79bf6EB2c4f870365E785982E1f101E93b906' // 3
            ],
            [
                'nama_biro' => 'Biro Kemahasiswaan',
                'wallet_address' => '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65' // 4
            ],
            [
                'nama_biro' => 'Biro Umum',
                'wallet_address' => '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc' // 5
            ],
            [
                'nama_biro' => 'Biro IT',
                'wallet_address' => '0x976EA74026E726554dB657fA54763abd0C3a0aa9' // 6
            ],
        ];

        foreach ($biros as $biro) {
            Biro::create([
                'nama_biro' => $biro['nama_biro'],
                'slug' => Str::slug($biro['nama_biro']),
                'wallet_address' => $biro['wallet_address'],
                'is_active' => true,
            ]);
        }
    }
}
