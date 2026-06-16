<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class AxeGearSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $categories = $this->ensureCategories();
            $collections = $this->ensureCollections();

            foreach (self::products() as $index => $productData) {
                $categoryId = $categories->get($productData['category_slug']);

                if (! $categoryId) {
                    throw new RuntimeException("Category slug [{$productData['category_slug']}] tidak ditemukan.");
                }

                $product = Product::query()->withTrashed()->updateOrCreate(
                    ['slug' => $productData['slug']],
                    [
                        'category_id' => $categoryId,
                        'name' => $productData['name'],
                        'sku' => $productData['sku'],
                        'brand_name' => 'AxeGear',
                        'product_line' => $productData['product_line'],
                        'style_name' => $productData['style_name'],
                        'regular_price' => $productData['regular_price'],
                        'sale_price' => $productData['sale_price'],
                        'short_description' => $productData['short_description'],
                        'description' => $productData['description'],
                        'stock_status' => $productData['stock_status'],
                        'weight' => $productData['weight'],
                        'length' => $productData['length'],
                        'width' => $productData['width'],
                        'height' => $productData['height'],
                        'status' => 'published',
                        'is_featured' => $productData['is_featured'],
                        'is_new_arrival' => $productData['is_new_arrival'],
                        'is_best_seller' => $productData['is_best_seller'],
                        'meta_title' => $productData['name'].' | AxeGear',
                        'meta_description' => $productData['short_description'],
                    ],
                );

                if ($product->trashed()) {
                    $product->restore();
                }

                $collectionIds = collect($productData['collection_slugs'])
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

                $product->collections()->sync($collectionIds);
                $this->syncImages($product, $productData['images']);
                $this->syncVariants($product, $productData);
            }
        });
    }

    private function ensureCategories()
    {
        $categories = [
            [
                'name' => 'Bags & Hydropacks',
                'slug' => 'bags-hydropacks',
                'description' => 'Trail bags, hydropacks, boot bags, and compact carry solutions for riding days.',
                'image_url' => 'https://down-id.img.susercontent.com/file/id-11134207-7r98w-loeyxusgxjru44',
                'sort_order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Bundles',
                'slug' => 'bundles',
                'description' => 'Value packs and bundled trail gear combinations from AxeGear.',
                'image_url' => 'https://down-id.img.susercontent.com/file/id-11134207-7r98p-low92wfi0sybc4',
                'sort_order' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Apparel & Gloves',
                'slug' => 'apparel-gloves',
                'description' => 'Technical jerseys, gloves, and wearable performance gear.',
                'image_url' => 'https://down-id.img.susercontent.com/file/id-11134207-7rbk2-m8okjffi65tu16',
                'sort_order' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Care & Utility',
                'slug' => 'care-utility',
                'description' => 'Cleaning, maintenance, and practical utility accessories for everyday use.',
                'image_url' => 'https://down-id.img.susercontent.com/file/sg-11134201-81zuc-mmvm1ymm58g4ee',
                'sort_order' => 40,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            $record = Category::query()->withTrashed()->updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );

            if ($record->trashed()) {
                $record->restore();
            }
        }

        return Category::query()->pluck('id', 'slug');
    }

    private function ensureCollections()
    {
        $collections = [
            [
                'name' => 'New Arrivals',
                'slug' => 'new-arrivals',
                'description' => 'Fresh AxeGear product drops sourced from the latest marketplace scrape.',
                'banner_desktop_url' => '/img/login-image.png',
                'banner_mobile_url' => '/img/login-image.png',
                'sort_order' => 10,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Sport Performance',
                'slug' => 'sport-performance',
                'description' => 'Technical trail and outdoor gear built for active performance.',
                'banner_desktop_url' => '/img/login-image.png',
                'banner_mobile_url' => '/img/login-image.png',
                'sort_order' => 20,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Explore Essentials',
                'slug' => 'explore-essentials',
                'description' => 'Everyday utility products, compact storage, and trail-day essentials.',
                'banner_desktop_url' => '/img/login-image.png',
                'banner_mobile_url' => '/img/login-image.png',
                'sort_order' => 30,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Sale',
                'slug' => 'sale',
                'description' => 'Bundled value offers and promo-friendly product groupings.',
                'banner_desktop_url' => '/img/login-image.png',
                'banner_mobile_url' => '/img/login-image.png',
                'sort_order' => 40,
                'is_featured' => false,
                'is_active' => true,
            ],
        ];

        foreach ($collections as $collection) {
            $record = Collection::query()->withTrashed()->updateOrCreate(
                ['slug' => $collection['slug']],
                $collection,
            );

            if ($record->trashed()) {
                $record->restore();
            }
        }

        return Collection::query()->pluck('id', 'slug');
    }

    private function syncImages(Product $product, array $images): void
    {
        $keptIds = [];

        foreach ($images as $sortOrder => $imageUrl) {
            $record = ProductImage::query()->withTrashed()->updateOrCreate(
                ['product_id' => $product->id, 'sort_order' => $sortOrder],
                [
                    'image_url' => $imageUrl,
                    'alt_text' => $product->name.' image '.($sortOrder + 1),
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
                    'barcode' => null,
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

    public static function products(): array
    {
        $path = base_path('new-data-scrapping.md');

        if (! file_exists($path)) {
            throw new RuntimeException("File new-data-scrapping.md tidak ditemukan di [{$path}].");
        }

        $content = file_get_contents($path);

        if ($content === false) {
            throw new RuntimeException("Gagal membaca file [{$path}].");
        }

        preg_match_all('/^##\s+\d+\.\s+(.+?)\R+(?<body>.*?)(?=^---\s*$|\z)/ms', $content, $matches, PREG_SET_ORDER);

        return collect($matches)
            ->map(fn (array $match, int $index): array => self::mapScrapedProduct($match[1], $match['body'], $index))
            ->values()
            ->all();
    }

    private static function mapScrapedProduct(string $name, string $body, int $index): array
    {
        $price = self::toRupiah(self::field($body, 'Harga'));
        $variationText = self::field($body, 'Variasi');
        $categoryText = self::field($body, 'Kategori');
        $notes = self::field($body, 'Layanan/Keterangan');
        $images = self::images($body);

        if ($price === 0 || $images === []) {
            throw new RuntimeException("Data scraping produk [{$name}] tidak lengkap.");
        }

        $categorySlug = self::categorySlug($name, $categoryText);
        $collectionSlugs = self::collectionSlugs($name, $categorySlug, $index);
        $variationCount = self::variationCount($variationText);
        $sku = self::sku($name, $index);
        $dimensions = self::dimensions($categorySlug);
        $stockStatus = str_contains(Str::lower($notes), 'habis') ? 'out_of_stock' : 'in_stock';
        $variants = self::variantsForProduct(
            name: $name,
            sku: $sku,
            images: $images,
            categorySlug: $categorySlug,
            variationCount: $variationCount,
            outOfStock: $stockStatus === 'out_of_stock',
        );

        $summary = trim(implode(' ', array_filter([
            $notes !== '' ? 'Catatan listing: '.$notes.'.' : null,
            $categoryText !== '' ? 'Kategori sumber: '.$categoryText.'.' : null,
            'URL sumber: '.(self::field($body, 'URL Produk') ?: '-').'.',
        ])));

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'sku' => $sku,
            'category_slug' => $categorySlug,
            'collection_slugs' => $collectionSlugs,
            'product_line' => self::productLine($name),
            'style_name' => self::styleName($name),
            'regular_price' => $price,
            'sale_price' => self::salePrice($name, $price),
            'short_description' => Str::limit(self::shortDescription($name, $categoryText, $variationText), 160),
            'description' => self::description($name, $categoryText, $variationText, $summary),
            'stock_status' => $stockStatus,
            'weight' => $dimensions['weight'],
            'length' => $dimensions['length'],
            'width' => $dimensions['width'],
            'height' => $dimensions['height'],
            'is_featured' => $index < 6 || str_contains(Str::lower($name), 'hydropack'),
            'is_new_arrival' => $index < 8,
            'is_best_seller' => str_contains(Str::lower($name), 'hydropack') || str_contains(Str::lower($name), 'gloves'),
            'images' => $images,
            'variants' => $variants,
        ];
    }

    private static function field(string $body, string $field): string
    {
        preg_match('/^- \*\*'.preg_quote($field, '/').':\*\*\s*(.+)$/m', $body, $match);

        return trim($match[1] ?? '');
    }

    private static function images(string $body): array
    {
        preg_match_all('/^\s*\d+\.\s+(https?:\/\/\S+)/m', $body, $matches);

        return array_values(array_unique($matches[1] ?? []));
    }

    private static function toRupiah(string $value): int
    {
        $normalized = preg_replace('/[^0-9]/', '', $value) ?? '';

        return $normalized === '' ? 0 : (int) $normalized;
    }

    private static function variationCount(string $value): int
    {
        if (preg_match('/(\d+)\s+variasi/i', $value, $match) === 1) {
            return max(1, (int) $match[1]);
        }

        return 1;
    }

    private static function categorySlug(string $name, string $categoryText): string
    {
        $haystack = Str::lower($name.' '.$categoryText);

        return match (true) {
            str_contains($haystack, 'bundling') => 'bundles',
            str_contains($haystack, 'jersey'),
            str_contains($haystack, 'sarung tangan'),
            str_contains($haystack, 'gloves') => 'apparel-gloves',
            str_contains($haystack, 'microfiber') => 'care-utility',
            default => 'bags-hydropacks',
        };
    }

    private static function collectionSlugs(string $name, string $categorySlug, int $index): array
    {
        $slugs = match ($categorySlug) {
            'apparel-gloves' => ['sport-performance'],
            'bundles' => ['explore-essentials', 'sale'],
            'care-utility' => ['explore-essentials'],
            default => str_contains(Str::lower($name), 'hydropack')
                ? ['sport-performance', 'explore-essentials']
                : ['explore-essentials'],
        };

        if ($index < 8) {
            $slugs[] = 'new-arrivals';
        }

        return array_values(array_unique($slugs));
    }

    private static function productLine(string $name): string
    {
        $lower = Str::lower($name);

        return match (true) {
            str_contains($lower, 'hydropack') => 'Hydropack',
            str_contains($lower, 'gloves'), str_contains($lower, 'sarung tangan') => 'Gloves',
            str_contains($lower, 'jersey'), str_contains($lower, 'atasan') => 'Jersey',
            str_contains($lower, 'microfiber') => 'Microfiber',
            str_contains($lower, 'strap') => 'Strap',
            str_contains($lower, 'boot bag') => 'Boot Bag',
            default => 'Trail Gear',
        };
    }

    private static function styleName(string $name): string
    {
        return Str::of($name)
            ->replace('AXEGEAR', '')
            ->replace('Axegear', '')
            ->replace('AxeGear', '')
            ->trim()
            ->value();
    }

    private static function salePrice(string $name, int $regularPrice): ?int
    {
        return str_contains(Str::lower($name), 'bundling') ? (int) round($regularPrice * 0.92) : null;
    }

    private static function shortDescription(string $name, string $categoryText, string $variationText): string
    {
        $parts = [
            $name,
            $categoryText !== '' ? 'kategori '.$categoryText : null,
            $variationText !== '-' && $variationText !== '' ? $variationText : null,
        ];

        return trim(implode(' - ', array_filter($parts)));
    }

    private static function description(string $name, string $categoryText, string $variationText, string $summary): string
    {
        $details = [
            $categoryText !== '' ? 'Kategori: '.$categoryText.'.' : null,
            $variationText !== '-' && $variationText !== '' ? 'Variasi listing: '.$variationText.'.' : null,
            $summary !== '' ? $summary : null,
        ];

        return trim($name.'. '.implode(' ', array_filter($details)));
    }

    private static function dimensions(string $categorySlug): array
    {
        return match ($categorySlug) {
            'bundles' => ['weight' => 1100, 'length' => 34, 'width' => 23, 'height' => 12],
            'apparel-gloves' => ['weight' => 280, 'length' => 29, 'width' => 22, 'height' => 4],
            'care-utility' => ['weight' => 120, 'length' => 20, 'width' => 15, 'height' => 4],
            default => ['weight' => 850, 'length' => 32, 'width' => 22, 'height' => 10],
        };
    }

    private static function variantsForProduct(
        string $name,
        string $sku,
        array $images,
        string $categorySlug,
        int $variationCount,
        bool $outOfStock,
    ): array {
        $stockPerVariant = $outOfStock ? 0 : max(6, (int) floor(24 / $variationCount));

        if ($categorySlug === 'apparel-gloves') {
            $sizes = ['M', 'L', 'XL', 'XXL'];

            return collect(range(1, $variationCount))
                ->map(function (int $index) use ($sizes, $sku, $stockPerVariant, $images, $name): array {
                    $size = $sizes[$index - 1] ?? 'XL';

                    return [
                        'sku' => $sku.'-SZ'.$size,
                        'variant_name' => self::isGloves($name) ? 'Size '.$size : 'Jersey '.$size,
                        'color_name' => 'Black',
                        'color_hex' => '#111111',
                        'size' => $size,
                        'package_type' => self::isGloves($name) ? 'Gloves' : 'Apparel',
                        'stock' => $stockPerVariant,
                        'image_url' => $images[($index - 1) % count($images)],
                    ];
                })
                ->all();
        }

        $colors = [
            ['name' => 'Black', 'hex' => '#111111'],
            ['name' => 'Orange', 'hex' => '#F58220'],
            ['name' => 'Graphite', 'hex' => '#4B4B4B'],
            ['name' => 'Sand', 'hex' => '#C7B08A'],
        ];

        return collect(range(1, $variationCount))
            ->map(function (int $index) use ($colors, $sku, $stockPerVariant, $images, $categorySlug, $variationCount): array {
                $color = $colors[$index - 1] ?? $colors[0];

                return [
                    'sku' => $sku.'-V'.$index,
                    'variant_name' => $variationCount === 1 ? 'Default Title' : $color['name'].' Variant',
                    'color_name' => $color['name'],
                    'color_hex' => $color['hex'],
                    'size' => 'One Size',
                    'package_type' => match ($categorySlug) {
                        'bundles' => 'Bundle',
                        'care-utility' => 'Accessory',
                        default => 'Bag',
                    },
                    'stock' => $stockPerVariant,
                    'image_url' => $images[($index - 1) % count($images)],
                ];
            })
            ->all();
    }

    private static function sku(string $name, int $index): string
    {
        $tail = Str::upper(Str::substr(preg_replace('/[^A-Za-z0-9]/', '', $name) ?? 'AXE', 0, 10));

        return 'AXE-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT).'-'.$tail;
    }

    private static function isGloves(string $name): bool
    {
        $lower = Str::lower($name);

        return str_contains($lower, 'gloves') || str_contains($lower, 'sarung tangan');
    }
}


