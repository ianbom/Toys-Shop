<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            CollectionSeeder::class,
            ProductSeeder::class,
            BannerSeeder::class,
            PageSeeder::class,
            SiteSettingSeeder::class,
        ]);
    }
}