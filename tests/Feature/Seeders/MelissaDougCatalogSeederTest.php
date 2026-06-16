<?php

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Database\Seeders\CategorySeeder;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('parses melissa and doug scraped products into canonical seed data', function () {
    $products = ProductSeeder::products();

    expect($products)->toHaveCount(10);

    $seeAndSpell = collect($products)->firstWhere('slug', 'see-spell-learning-toy');
    $msRachel = collect($products)->firstWhere('slug', 'ms-rachel-learning-toys-gift-bundle');
    $hungryPelican = collect($products)->firstWhere('slug', 'ks-kids-hungry-pelican');

    expect($seeAndSpell)
        ->not->toBeNull()
        ->and($seeAndSpell['regular_price'])->toBe(495840)
        ->and($seeAndSpell['sale_price'])->toBeNull()
        ->and($seeAndSpell['stock_status'])->toBe('in_stock')
        ->and($seeAndSpell['category_slug'])->toBe('literacy-toy')
        ->and($seeAndSpell['images'])->toHaveCount(3)
        ->and($seeAndSpell['variants'])->toHaveCount(1)
        ->and($seeAndSpell['variants'][0]['stock'])->toBeGreaterThan(0);

    expect($msRachel)
        ->not->toBeNull()
        ->and($msRachel['regular_price'])->toBe(879680)
        ->and($msRachel['sale_price'])->toBe(687840);

    expect($hungryPelican)
        ->not->toBeNull()
        ->and($hungryPelican['stock_status'])->toBe('out_of_stock')
        ->and($hungryPelican['variants'][0]['stock'])->toBe(0);
});

it('seeds hierarchical categories from scraped category paths', function () {
    $this->seed(CategorySeeder::class);

    $learningToys = Category::query()->where('slug', 'learning-toys')->first();
    $alphabetAndCounting = Category::query()->where('slug', 'alphabet-counting')->first();
    $literacyToy = Category::query()->where('slug', 'literacy-toy')->first();

    expect($learningToys)->not->toBeNull();
    expect($alphabetAndCounting)->not->toBeNull();
    expect($literacyToy)->not->toBeNull();

    expect($alphabetAndCounting->parent_id)->toBe($learningToys->id)
        ->and($literacyToy->parent_id)->toBe($alphabetAndCounting->id);

    expect(Category::query()->where('name', 'Motor Skills')->count())->toBe(3);
});

it('seeds melissa and doug as the primary catalog dataset', function () {
    $this->seed(DatabaseSeeder::class);

    expect(Product::query()->count())->toBe(10)
        ->and(Product::query()->where('brand_name', 'Melissa & Doug')->count())->toBe(10)
        ->and(Product::query()->where('brand_name', 'AxeGear')->count())->toBe(0)
        ->and(Collection::query()->where('slug', 'featured-learning-toys')->exists())->toBeTrue();

    $soldOut = Product::query()->where('stock_status', 'out_of_stock')->count();
    $sale = Product::query()->whereNotNull('sale_price')->count();

    expect($soldOut)->toBe(3)
        ->and($sale)->toBe(2)
        ->and(Product::query()->whereHas('images')->count())->toBe(10)
        ->and(Product::query()->whereHas('variants')->count())->toBe(10);
});
