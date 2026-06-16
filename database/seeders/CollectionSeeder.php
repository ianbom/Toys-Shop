<?php

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (ProductSeeder::collectionSeedData() as $collection) {
            $record = Collection::query()->withTrashed()->updateOrCreate(
                ['slug' => $collection['slug']],
                $collection,
            );

            if ($record->trashed()) {
                $record->restore();
            }
        }
    }
}