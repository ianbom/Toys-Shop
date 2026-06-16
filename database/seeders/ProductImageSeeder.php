<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use RuntimeException;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        $imagesByProduct = collect(ProductSeeder::products())
            ->mapWithKeys(fn (array $product): array => [
                $product['slug'] => collect($product['images'])
                    ->map(fn (string $imageUrl, int $sortOrder): array => [
                        'image_url' => $imageUrl,
                        'alt_text' => 'Melissa & Doug '.$product['name'].' image '.($sortOrder + 1),
                        'sort_order' => $sortOrder,
                        'is_primary' => $sortOrder === 0,
                    ])
                    ->all(),
            ])
            ->all();

        $products = Product::query()->whereIn('slug', array_keys($imagesByProduct))->get()->keyBy('slug');

        foreach ($imagesByProduct as $productSlug => $images) {
            $product = $products->get($productSlug);

            if (! $product) {
                throw new RuntimeException("Product slug [{$productSlug}] tidak ditemukan.");
            }

            $keptIds = [];

            foreach ($images as $image) {
                $record = ProductImage::query()->withTrashed()->updateOrCreate(
                    ['product_id' => $product->id, 'sort_order' => $image['sort_order']],
                    [
                        'image_url' => $image['image_url'],
                        'alt_text' => $image['alt_text'],
                        'is_primary' => $image['is_primary'],
                    ],
                );

                if ($record->trashed()) {
                    $record->restore();
                }

                $keptIds[] = $record->id;
            }

            ProductImage::query()->where('product_id', $product->id)->whereNotIn('id', $keptIds)->delete();
        }
    }
}