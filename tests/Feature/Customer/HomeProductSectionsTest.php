<?php

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows latest new arrivals and latest best sellers on home page', function () {
    $baseTime = Carbon::parse('2026-05-21 10:00:00');

    foreach (range(1, 6) as $index) {
        createHomeProduct([
            'name' => "New Arrival {$index}",
            'is_new_arrival' => true,
            'created_at' => $baseTime->copy()->addMinutes($index),
        ]);
    }

    createHomeProduct([
        'name' => 'Sale Only Product',
        'sale_price' => 90000,
        'is_new_arrival' => false,
        'created_at' => $baseTime->copy()->addMinutes(20),
    ]);

    foreach (range(1, 5) as $index) {
        createHomeProduct([
            'name' => "Best Seller {$index}",
            'is_best_seller' => true,
            'created_at' => $baseTime->copy()->addMinutes($index),
        ]);
    }

    createHomeProduct([
        'name' => 'Featured Only Product',
        'is_featured' => true,
        'is_best_seller' => false,
        'created_at' => $baseTime->copy()->addMinutes(30),
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('wePresent', 5)
            ->where('wePresent.0.name', 'New Arrival 6')
            ->where('wePresent.4.name', 'New Arrival 2')
            ->has('mostLoved', 4)
            ->where('mostLoved.0.name', 'Best Seller 5')
            ->where('mostLoved.3.name', 'Best Seller 2'));
});

/**
 * @param  array<string, mixed>  $overrides
 */
function createHomeProduct(array $overrides = []): Product
{
    $name = (string) ($overrides['name'] ?? 'Home Product '.Str::random(8));
    $timestamps = array_intersect_key($overrides, array_flip(['created_at', 'updated_at']));
    $attributes = array_diff_key($overrides, $timestamps);

    $product = Product::query()->create([
        ...[
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'regular_price' => 100000,
            'status' => 'published',
        ],
        ...$attributes,
    ]);

    if ($timestamps !== []) {
        $product->forceFill([
            ...$timestamps,
            'updated_at' => $timestamps['updated_at'] ?? $timestamps['created_at'],
        ])->save();
    }

    return $product;
}
