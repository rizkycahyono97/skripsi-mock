<?php

namespace Database\Seeders;

use App\Models\User;
use Dom\DocumentFragment;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // create user
        $arsipUser = User::create([
            'name' => 'Admin Arsip',
            'email' => 'arsip@mail.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'arsip',
        ]);

        // $this->call([
        //     DocumentFragment::class,
        // ]);
    }
}
