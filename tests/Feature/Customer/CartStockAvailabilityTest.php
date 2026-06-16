<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\CustomerAddress;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('marks cart item unavailable when quantity exceeds available stock', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCartStockProduct(stock: 2, reservedStock: 1);

    createCartStockItem($user, $product, $variant, quantity: 3);

    $this->actingAs($user)
        ->get(route('cart'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/cart/my-cart')
            ->where('cartItems.0.quantity', 3)
            ->where('cartItems.0.available_stock', 1)
            ->where('cartItems.0.is_available', false));
});

it('marks cart item available when quantity fits available stock', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCartStockProduct(stock: 2, reservedStock: 1);

    createCartStockItem($user, $product, $variant, quantity: 1);

    $this->actingAs($user)
        ->get(route('cart'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/cart/my-cart')
            ->where('cartItems.0.quantity', 1)
            ->where('cartItems.0.available_stock', 1)
            ->where('cartItems.0.is_available', true));
});

it('redirects checkout to cart when cart is empty', function () {
    $user = User::factory()->create();
    createCartStockAddress($user);

    $this->actingAs($user)
        ->get(route('checkout'))
        ->assertRedirect(route('cart'))
        ->assertSessionHas('warning');
});

it('renders checkout with unavailable item when stock is insufficient', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCartStockProduct(stock: 2, reservedStock: 1);

    createCartStockAddress($user);
    createCartStockItem($user, $product, $variant, quantity: 3);

    $this->actingAs($user)
        ->get(route('checkout'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/checkout/checkout')
            ->where('cartItems.0.quantity', 3)
            ->where('cartItems.0.available_stock', 1)
            ->where('cartItems.0.is_available', false));
});

it('renders checkout when cart stock is valid and address exists', function () {
    $user = User::factory()->create();
    [$product, $variant] = createCartStockProduct(stock: 2, reservedStock: 1);

    createCartStockAddress($user);
    createCartStockItem($user, $product, $variant, quantity: 1);

    $this->actingAs($user)
        ->get(route('checkout'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/checkout/checkout')
            ->where('cartItems.0.quantity', 1)
            ->where('cartItems.0.available_stock', 1)
            ->where('cartItems.0.is_available', true));
});

/**
 * @return array{0: Product, 1: ProductVariant}
 */
function createCartStockProduct(int $stock, int $reservedStock): array
{
    $name = 'Cart Stock Product '.Str::random(8);
    $product = Product::query()->create([
        'name' => $name,
        'slug' => Str::slug($name).'-'.Str::lower(Str::random(6)),
        'regular_price' => 100000,
        'weight' => 500,
        'status' => 'published',
    ]);
    $variant = ProductVariant::query()->create([
        'product_id' => $product->id,
        'sku' => 'CART-STOCK-'.Str::upper(Str::random(8)),
        'color_name' => 'Black',
        'size' => 'M',
        'stock' => $stock,
        'reserved_stock' => $reservedStock,
        'is_active' => true,
    ]);

    return [$product, $variant];
}

function createCartStockItem(User $user, Product $product, ProductVariant $variant, int $quantity): CartItem
{
    $cart = Cart::query()->create(['user_id' => $user->id]);

    return CartItem::query()->create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'product_variant_id' => $variant->id,
        'quantity' => $quantity,
        'price_snapshot' => 100000,
    ]);
}

function createCartStockAddress(User $user): CustomerAddress
{
    return CustomerAddress::query()->create([
        'user_id' => $user->id,
        'recipient_name' => 'Siti Aisyah',
        'recipient_phone' => '081234567890',
        'label' => 'Home',
        'province' => 'Jawa Barat',
        'city' => 'Bandung',
        'district' => 'Coblong',
        'subdistrict' => 'Dago',
        'postal_code' => '40135',
        'full_address' => 'Jl. Dipatiukur No. 10',
        'biteship_area_id' => 'IDNP6IDNC148IDND631IDZ40135',
        'is_default' => true,
    ]);
}
