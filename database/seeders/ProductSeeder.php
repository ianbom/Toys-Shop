<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductMarketplaceLink;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class ProductSeeder extends Seeder
{
    private const BRAND_NAME = 'Melissa & Doug';

    public function run(): void
    {
        DB::transaction(function (): void {
            $categories = Category::query()->pluck('id', 'slug');
            $collections = Collection::query()->pluck('id', 'slug');
            $products = self::products();
            $seededSkus = [];

            foreach ($products as $product) {
                $categoryId = $categories->get($product['category_slug']);

                if (! $categoryId) {
                    throw new RuntimeException("Category slug [{$product['category_slug']}] tidak ditemukan.");
                }

                $record = Product::query()->withTrashed()->updateOrCreate(
                    ['slug' => $product['slug']],
                    [
                        'category_id' => $categoryId,
                        'name' => $product['name'],
                        'sku' => $product['sku'],
                        'brand_name' => self::BRAND_NAME,
                        'product_line' => $product['product_line'],
                        'style_name' => $product['style_name'],
                        'regular_price' => $product['regular_price'],
                        'sale_price' => $product['sale_price'],
                        'short_description' => $product['short_description'],
                        'description' => $product['description'],
                        'stock_status' => $product['stock_status'],
                        'weight' => $product['weight'],
                        'length' => $product['length'],
                        'width' => $product['width'],
                        'height' => $product['height'],
                        'status' => 'published',
                        'is_featured' => $product['is_featured'],
                        'is_new_arrival' => $product['is_new_arrival'],
                        'is_best_seller' => $product['is_best_seller'],
                        'meta_title' => $product['name'].' | '.self::BRAND_NAME,
                        'meta_description' => $product['short_description'],
                    ],
                );

                if ($record->trashed()) {
                    $record->restore();
                }

                $collectionIds = collect($product['collection_slugs'])
                    ->map(function (string $slug) use ($collections): int {
                        $collectionId = $collections->get($slug);

                        if (! $collectionId) {
                            throw new RuntimeException("Collection slug [{$slug}] tidak ditemukan.");
                        }

                        return $collectionId;
                    })
                    ->mapWithKeys(fn (int $collectionId, int $sortIndex): array => [
                        $collectionId => ['sort_order' => $sortIndex + 1],
                    ])
                    ->all();

                $record->collections()->sync($collectionIds);
                $this->syncImages($record, $product['images']);
                $this->syncVariants($record, $product);
                $this->syncMarketplaceLink($record, $product);

                $seededSkus[] = $product['sku'];
            }

            Product::query()
                ->where('sku', 'like', 'MLD-%')
                ->whereNotIn('sku', $seededSkus)
                ->delete();
        });
    }

    private function syncImages(Product $product, array $images): void
    {
        $keptIds = [];

        foreach ($images as $sortOrder => $imageUrl) {
            $record = ProductImage::query()->withTrashed()->updateOrCreate(
                ['product_id' => $product->id, 'sort_order' => $sortOrder],
                [
                    'image_url' => $imageUrl,
                    'alt_text' => self::BRAND_NAME.' '.$product->name.' image '.($sortOrder + 1),
                    'is_primary' => $sortOrder === 0,
                ],
            );

            if ($record->trashed()) {
                $record->restore();
            }

            $keptIds[] = $record->id;
        }

        ProductImage::query()
            ->where('product_id', $product->id)
            ->whereNotIn('id', $keptIds)
            ->delete();
    }

    private function syncVariants(Product $product, array $productData): void
    {
        $keptSkus = [];

        foreach ($productData['variants'] as $variant) {
            $record = ProductVariant::query()->withTrashed()->updateOrCreate(
                ['sku' => $variant['sku']],
                [
                    'product_id' => $product->id,
                    'barcode' => $variant['barcode'],
                    'variant_name' => $variant['variant_name'],
                    'color_name' => $variant['color_name'],
                    'color_hex' => $variant['color_hex'],
                    'size' => $variant['size'],
                    'package_type' => $variant['package_type'],
                    'regular_price' => $productData['regular_price'],
                    'sale_price' => $productData['sale_price'],
                    'stock' => $variant['stock'],
                    'reserved_stock' => 0,
                    'desty_available_stock' => $variant['stock'],
                    'desty_on_hand_stock' => $variant['stock'],
                    'desty_reserved_stock' => 0,
                    'stock_source' => 'manual',
                    'allow_manual_stock_edit' => true,
                    'weight' => $productData['weight'],
                    'length' => $productData['length'],
                    'width' => $productData['width'],
                    'height' => $productData['height'],
                    'image_url' => $variant['image_url'],
                    'is_active' => true,
                ],
            );

            if ($record->trashed()) {
                $record->restore();
            }

            $keptSkus[] = $variant['sku'];
        }

        ProductVariant::query()
            ->where('product_id', $product->id)
            ->whereNotIn('sku', $keptSkus)
            ->delete();
    }

    private function syncMarketplaceLink(Product $product, array $productData): void
    {
        ProductMarketplaceLink::query()->updateOrCreate(
            [
                'product_id' => $product->id,
                'marketplace_name' => 'Melissa & Doug',
            ],
            [
                'external_product_id' => $productData['item_number'] !== '' ? $productData['item_number'] : $productData['slug'],
                'external_sku' => $productData['sku'],
                'product_url' => $productData['product_url'],
                'price_snapshot' => $productData['sale_price'] ?? $productData['regular_price'],
                'stock_snapshot' => collect($productData['variants'])->sum('stock'),
                'last_synced_at' => now(),
                'is_active' => true,
            ],
        );
    }

    public static function products(): array
    {
        $slugStrategy = self::categorySlugStrategy();

        return collect(self::rawProducts())
            ->map(fn (array $product, int $index): array => self::mapProduct($product, $index, $slugStrategy))
            ->all();
    }

    public static function categorySeedData(): array
    {
        $products = self::rawProducts();
        $slugStrategy = self::categorySlugStrategy();
        $records = [];

        foreach ($products as $product) {
            $segments = self::categorySegments($product['category_path']);
            $path = [];
            $parentPath = null;

            foreach ($segments as $segment) {
                $path[] = $segment;
                $pathKey = implode(' > ', $path);
                $slug = $slugStrategy[$pathKey] ?? Str::slug($segment);
                $parentSlug = $parentPath !== null ? ($slugStrategy[$parentPath] ?? null) : null;

                $records[$pathKey] = [
                    'name' => $segment,
                    'slug' => $slug,
                    'parent_slug' => $parentSlug,
                    'description' => self::categoryDescription($path),
                    'image_url' => $product['images'][0] ?? null,
                    'sort_order' => count($path) * 10,
                    'is_active' => true,
                ];

                $parentPath = $pathKey;
            }
        }

        return array_values($records);
    }

    public static function collectionSeedData(): array
    {
        $products = self::products();

        return [
            [
                'name' => 'New Arrivals',
                'slug' => 'new-arrivals',
                'description' => 'Fresh Melissa & Doug learning toys curated from the latest scraped catalog.',
                'banner_desktop_url' => self::collectionBanner($products, 'new-arrivals'),
                'banner_mobile_url' => self::collectionBanner($products, 'new-arrivals'),
                'sort_order' => 10,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Featured Learning Toys',
                'slug' => 'featured-learning-toys',
                'description' => 'Highlighted Melissa & Doug learning toys for discovery and merchandising.',
                'banner_desktop_url' => self::collectionBanner($products, 'featured-learning-toys'),
                'banner_mobile_url' => self::collectionBanner($products, 'featured-learning-toys'),
                'sort_order' => 20,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Sale',
                'slug' => 'sale',
                'description' => 'Discounted Melissa & Doug learning toys with active sale pricing.',
                'banner_desktop_url' => self::collectionBanner($products, 'sale'),
                'banner_mobile_url' => self::collectionBanner($products, 'sale'),
                'sort_order' => 30,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Sold Out',
                'slug' => 'sold-out',
                'description' => 'Products currently marked out of stock in the source catalog.',
                'banner_desktop_url' => self::collectionBanner($products, 'sold-out'),
                'banner_mobile_url' => self::collectionBanner($products, 'sold-out'),
                'sort_order' => 40,
                'is_featured' => false,
                'is_active' => true,
            ],
        ];
    }

    private static function rawProducts(): array
    {
        $path = base_path('data-scrapping.md');

        if (! file_exists($path)) {
            throw new RuntimeException("File data-scrapping.md tidak ditemukan di [{$path}].");
        }

        $content = file_get_contents($path);

        if ($content === false) {
            throw new RuntimeException("Gagal membaca file [{$path}].");
        }

        preg_match_all('/^##\s+\d+\.\s+(.+?)\R+(?<body>.*?)(?=^---\s*$|\z)/ms', $content, $matches, PREG_SET_ORDER);

        return collect($matches)
            ->map(fn (array $match): array => self::extractRawProduct(trim($match[1]), $match['body']))
            ->all();
    }

    private static function extractRawProduct(string $name, string $body): array
    {
        return [
            'name' => $name,
            'category_path' => self::field($body, 'Kategori'),
            'age' => self::field($body, 'Usia'),
            'price' => self::field($body, 'Harga'),
            'sale_price' => self::field($body, 'Sale Price'),
            'regular_price' => self::field($body, 'Regular Price'),
            'stock_status_text' => self::field($body, 'Status stok'),
            'button_status' => self::field($body, 'Status tombol'),
            'availability' => self::field($body, 'Ketersediaan'),
            'product_url' => self::field($body, 'Product URL'),
            'summary' => self::sectionParagraph($body, 'Deskripsi Singkat'),
            'details' => self::sectionBullets($body, 'Detail Produk'),
            'dimensions' => self::sectionBullets($body, 'Dimensi'),
            'images' => self::sectionImages($body, 'Foto Produk'),
            'item_number' => self::extractTaggedValue(self::sectionBullets($body, 'Detail Produk'), 'Item #:'),
            'batteries_required' => self::extractTaggedValue(self::sectionBullets($body, 'Detail Produk'), 'Batteries Required:'),
        ];
    }

    private static function mapProduct(array $product, int $index, array $slugStrategy): array
    {
        $categorySegments = self::categorySegments($product['category_path']);
        $categoryPathKey = implode(' > ', $categorySegments);
        $categorySlug = $slugStrategy[$categoryPathKey] ?? Str::slug((string) end($categorySegments));
        $salePrice = self::parseUsd($product['sale_price']);
        $regularPrice = self::parseUsd($product['regular_price'] !== '' ? $product['regular_price'] : $product['price']);
        $stockStatus = self::stockStatus($product);
        $dimensions = self::parseDimensions($product['dimensions']);
        $collectionSlugs = ['new-arrivals'];

        if ($salePrice !== null && $regularPrice !== null && $salePrice < $regularPrice) {
            $collectionSlugs[] = 'sale';
        }

        if ($stockStatus === 'out_of_stock') {
            $collectionSlugs[] = 'sold-out';
        }

        if ($index < 4) {
            $collectionSlugs[] = 'featured-learning-toys';
        }

        if ($regularPrice === null || $product['images'] === []) {
            throw new RuntimeException("Data scraping produk [{$product['name']}] tidak lengkap.");
        }

        $sku = sprintf('MLD-%03d', $index + 1);

        return [
            'name' => $product['name'],
            'slug' => Str::slug($product['name']),
            'sku' => $sku,
            'category_slug' => $categorySlug,
            'collection_slugs' => array_values(array_unique($collectionSlugs)),
            'product_line' => $categorySegments[1] ?? $categorySegments[0] ?? 'Learning Toys',
            'style_name' => $product['age'] !== '' ? $product['age'] : (($product['item_number'] !== '') ? 'Item '.$product['item_number'] : 'Standard'),
            'regular_price' => $regularPrice,
            'sale_price' => $salePrice !== null && $salePrice < $regularPrice ? $salePrice : null,
            'short_description' => Str::limit($product['summary'], 160),
            'description' => self::buildDescription($product),
            'stock_status' => $stockStatus,
            'weight' => self::weightForCategory($categorySegments),
            'length' => $dimensions['length'],
            'width' => $dimensions['width'],
            'height' => $dimensions['height'],
            'is_featured' => $index < 4,
            'is_new_arrival' => true,
            'is_best_seller' => $index < 3,
            'item_number' => $product['item_number'],
            'product_url' => $product['product_url'],
            'images' => $product['images'],
            'variants' => [[
                'sku' => $sku.'-DEFAULT',
                'barcode' => $product['item_number'] !== '' ? 'MD-'.$product['item_number'] : null,
                'variant_name' => 'Default Set',
                'color_name' => 'Multicolor',
                'color_hex' => '#D97706',
                'size' => 'Standard',
                'package_type' => self::packageType($categorySegments),
                'stock' => $stockStatus === 'out_of_stock' ? 0 : self::variantStock($product),
                'image_url' => $product['images'][0] ?? null,
            ]],
        ];
    }

    private static function field(string $body, string $field): string
    {
        preg_match('/^\*\*'.preg_quote($field, '/').':\*\*\s*(.+)$/m', $body, $match);

        return trim($match[1] ?? '');
    }

    private static function sectionParagraph(string $body, string $heading): string
    {
        if (preg_match('/^###\s+'.preg_quote($heading, '/').'\R(?<content>.*?)(?=^###\s+|\z)/ms', $body, $match) !== 1) {
            return '';
        }

        $lines = collect(preg_split('/\R/', trim($match['content'])) ?: [])
            ->map(fn (string $line): string => trim($line))
            ->reject(fn (string $line): bool => $line === '' || str_starts_with($line, '-') || preg_match('/^\d+\./', $line) === 1)
            ->values();

        return $lines->implode(' ');
    }

    private static function sectionBullets(string $body, string $heading): array
    {
        if (preg_match('/^###\s+'.preg_quote($heading, '/').'\R(?<content>.*?)(?=^###\s+|\z)/ms', $body, $match) !== 1) {
            return [];
        }

        return collect(preg_split('/\R/', trim($match['content'])) ?: [])
            ->map(fn (string $line): string => trim($line))
            ->filter(fn (string $line): bool => str_starts_with($line, '- '))
            ->map(fn (string $line): string => trim(Str::after($line, '- ')))
            ->values()
            ->all();
    }

    private static function sectionImages(string $body, string $heading): array
    {
        if (preg_match('/^###\s+'.preg_quote($heading, '/').'\R(?<content>.*?)(?=^###\s+|\z)/ms', $body, $match) !== 1) {
            return [];
        }

        preg_match_all('/^\d+\.\s+(https?:\/\/\S+)/m', $match['content'], $matches);

        return array_values(array_unique($matches[1] ?? []));
    }

    private static function extractTaggedValue(array $bullets, string $prefix): string
    {
        foreach ($bullets as $bullet) {
            $plain = str_replace('**', '', $bullet);

            if (str_starts_with($plain, $prefix)) {
                return trim(Str::after($plain, $prefix));
            }
        }

        return '';
    }

    private static function buildDescription(array $product): string
    {
        $parts = [];

        if ($product['summary'] !== '') {
            $parts[] = $product['summary'];
        }

        if ($product['details'] !== []) {
            $parts[] = 'Highlights: '.implode(' ', $product['details']);
        }

        $meta = array_filter([
            $product['age'] !== '' ? 'Age: '.$product['age'].'.' : null,
            $product['item_number'] !== '' ? 'Item #: '.$product['item_number'].'.' : null,
            $product['batteries_required'] !== '' ? 'Batteries Required: '.$product['batteries_required'].'.' : null,
            $product['product_url'] !== '' ? 'Source: '.$product['product_url'].'.' : null,
        ]);

        if ($meta !== []) {
            $parts[] = implode(' ', $meta);
        }

        return trim(implode("\n\n", $parts));
    }

    private static function stockStatus(array $product): string
    {
        $text = Str::lower(implode(' ', array_filter([
            $product['stock_status_text'],
            $product['button_status'],
            $product['availability'],
        ])));

        return str_contains($text, 'sold out') || str_contains($text, 'out of stock')
            ? 'out_of_stock'
            : 'in_stock';
    }

    private static function variantStock(array $product): int
    {
        $text = Str::lower($product['stock_status_text'].' '.$product['button_status'].' '.$product['availability']);

        if (preg_match('/only\s+(\d+)\s+left/', $text, $match) === 1) {
            return (int) $match[1];
        }

        if (preg_match('/(\d+)\s+in stock/', $text, $match) === 1) {
            return (int) $match[1];
        }

        return 24;
    }

    private static function categorySegments(string $categoryPath): array
    {
        return collect(explode('/', $categoryPath))
            ->map(fn (string $segment): string => trim($segment))
            ->filter()
            ->values()
            ->all();
    }

    private static function categorySlugStrategy(): array
    {
        $paths = collect(self::rawProducts())
            ->map(fn (array $product): array => self::categorySegments($product['category_path']));

        $nodes = [];

        foreach ($paths as $segments) {
            $path = [];

            foreach ($segments as $segment) {
                $path[] = $segment;
                $pathKey = implode(' > ', $path);
                $nodes[$pathKey] = [
                    'path' => $path,
                    'base_slug' => Str::slug($segment),
                ];
            }
        }

        $slugCounts = collect($nodes)->groupBy('base_slug')->map->count()->all();

        return collect($nodes)
            ->mapWithKeys(function (array $node, string $pathKey) use ($slugCounts): array {
                $slug = ($slugCounts[$node['base_slug']] ?? 0) > 1
                    ? Str::slug(implode(' ', $node['path']))
                    : $node['base_slug'];

                return [$pathKey => $slug];
            })
            ->all();
    }

    private static function categoryDescription(array $path): string
    {
        return 'Curated Melissa & Doug category: '.implode(' / ', $path).'.';
    }

    private static function collectionBanner(array $products, string $slug): ?string
    {
        foreach ($products as $product) {
            if (in_array($slug, $product['collection_slugs'], true)) {
                return $product['images'][0] ?? null;
            }
        }

        return null;
    }

    private static function parseUsd(string $price): ?int
    {
        $normalized = trim(str_replace(['$', ','], '', $price));

        if ($normalized === '') {
            return null;
        }

        return (int) round(((float) $normalized) * 16000);
    }

    private static function parseDimensions(array $bullets): array
    {
        $productLine = collect($bullets)->first(fn (string $bullet): bool => str_starts_with($bullet, '**Product:**'));
        $source = $productLine ?? collect($bullets)->first(fn (string $bullet): bool => str_starts_with($bullet, '**Package:**'));

        if (! $source || preg_match('/([\d.]+)\s+x\s+([\d.]+)\s+x\s+([\d.]+)/i', $source, $match) !== 1) {
            return ['length' => 25, 'width' => 20, 'height' => 8];
        }

        return [
            'length' => (int) round((float) $match[1]),
            'width' => (int) round((float) $match[2]),
            'height' => (int) round((float) $match[3]),
        ];
    }

    private static function weightForCategory(array $segments): int
    {
        $haystack = Str::lower(implode(' ', $segments));

        return match (true) {
            str_contains($haystack, 'baby') => 650,
            str_contains($haystack, 'bundle') => 1200,
            default => 900,
        };
    }

    private static function packageType(array $segments): string
    {
        $haystack = Str::lower(implode(' ', $segments));

        return match (true) {
            str_contains($haystack, 'baby') => 'Baby Toy',
            str_contains($haystack, 'bundle') => 'Gift Bundle',
            default => 'Learning Toy',
        };
    }
}