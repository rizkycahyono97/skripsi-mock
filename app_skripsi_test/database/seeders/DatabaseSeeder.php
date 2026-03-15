<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
    }
}
