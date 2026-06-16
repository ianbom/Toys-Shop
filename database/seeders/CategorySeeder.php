<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $records = collect(ProductSeeder::categorySeedData());

        foreach ($records as $category) {
            $record = Category::query()->withTrashed()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'parent_id' => null,
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'image_url' => $category['image_url'],
                    'sort_order' => $category['sort_order'],
                    'is_active' => $category['is_active'],
                ],
            );

            if ($record->trashed()) {
                $record->restore();
            }
        }

        $categoryIds = Category::query()->pluck('id', 'slug');

        foreach ($records as $category) {
            Category::query()
                ->where('slug', $category['slug'])
                ->update(['parent_id' => $category['parent_slug'] ? $categoryIds->get($category['parent_slug']) : null]);
        }
    }
}