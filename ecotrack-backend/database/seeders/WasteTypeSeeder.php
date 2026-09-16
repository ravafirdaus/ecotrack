<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WasteTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('waste_types')->insert([
            [
                'name' => 'Plastik',
                'description' => 'Sampah berbahan plastik seperti botol dan kemasan',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Kertas',
                'description' => 'Sampah kertas seperti kardus dan koran',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Organik',
                'description' => 'Sampah sisa makanan dan bahan alami',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Logam',
                'description' => 'Sampah berbahan logam seperti kaleng',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Elektronik',
                'description' => 'Sampah perangkat elektronik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}