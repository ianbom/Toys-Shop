<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('includes existing cart quantity for each product detail variant', function () {
    $user = User::factory()->create();
    $product = createDetailProduct();
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'SKU-'.Str::upper(Str::random(8)),
        'color_name' => 'Black',
        'size' => 'M',
        'stock' => 5,
        'reserved_stock' => 0,
        'is_active' => true,
    ]);
    $cart = Cart::query()->create(['user_id' => $user->id]);
    CartItem::query()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => 5,
        'price_snapshot' => 100000,
    ]);

    $this->actingAs($user)
        ->get(route('detail', ['product' => $product->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/products/detail-product')
            ->where('product.variants.0.id', $variant->id)
            ->where('product.variants.0.available_stock', 5)
            ->where('product.variants.0.cart_quantity', 5));
});

/**
 * @param  array<string, mixed>  $overrides
 */
function createDetailProduct(array $overrides = []): Product
{
    $name = (string) ($overrides['name'] ?? 'Detail Product '.Str::random(8));

    return Product::query()->create([
        ...[
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
            'regular_price' => 100000,
            'status' => 'published',
        ],
        ...$overrides,
    ]);
}
