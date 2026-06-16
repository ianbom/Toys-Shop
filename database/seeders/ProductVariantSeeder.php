<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use RuntimeException;

class ProductVariantSeeder extends Seeder
{
    public function run(): void
    {
        $variants = collect(ProductSeeder::products())
            ->flatMap(fn (array $product): array => collect($product['variants'])
                ->map(fn (array $variant): array => [
                    ...$variant,
                    'product_slug' => $product['slug'],
                    'regular_price' => $product['regular_price'],
                    'sale_price' => $product['sale_price'],
                    'weight' => $product['weight'],
                    'length' => $product['length'],
                    'width' => $product['width'],
                    'height' => $product['height'],
                ])
                ->all())
            ->values();

        $productIds = Product::query()
            ->whereIn('slug', $variants->pluck('product_slug')->unique()->all())
            ->pluck('id', 'slug');

        $keptVariantSkus = [];

        foreach ($variants as $variant) {
            $productId = $productIds->get($variant['product_slug']);

            if (! $productId) {
                throw new RuntimeException("Product slug [{$variant['product_slug']}] tidak ditemukan.");
            }

            $record = ProductVariant::query()->withTrashed()->updateOrCreate(
                ['sku' => $variant['sku']],
                [
                    'product_id' => $productId,
                    'barcode' => $variant['barcode'],
                    'variant_name' => $variant['variant_name'],
                    'color_name' => $variant['color_name'],
                    'color_hex' => $variant['color_hex'],
                    'size' => $variant['size'],
                    'package_type' => $variant['package_type'],
                    'regular_price' => $variant['regular_price'],
                    'sale_price' => $variant['sale_price'],
                    'stock' => $variant['stock'],
                    'reserved_stock' => 0,
                    'desty_available_stock' => $variant['stock'],
                    'desty_on_hand_stock' => $variant['stock'],
                    'desty_reserved_stock' => 0,
                    'stock_source' => 'manual',
                    'allow_manual_stock_edit' => true,
                    'weight' => $variant['weight'],
                    'length' => $variant['length'],
                    'width' => $variant['width'],
                    'height' => $variant['height'],
                    'image_url' => $variant['image_url'],
                    'is_active' => true,
                ],
            );

            if ($record->trashed()) {
                $record->restore();
            }

            $keptVariantSkus[] = $record->sku;
        }

        ProductVariant::query()
            ->whereIn('product_id', $productIds->values())
            ->whereNotIn('sku', $keptVariantSkus)
            ->delete();
    }
}