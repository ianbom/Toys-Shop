<?php

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('redirects guests to login before storing wishlist products', function () {
    $product = createWishlistProduct(['status' => 'published']);

    $this->post(route('wishlist.store', $product))
        ->assertRedirect(route('login'));

    $this->assertDatabaseMissing('wishlists', [
        'product_id' => $product->id,
    ]);
});

it('adds a wishlist product through json without redirecting the product list', function () {
    $user = User::factory()->create();
    $product = createWishlistProduct(['status' => 'published']);

    $this->actingAs($user)
        ->postJson(route('wishlist.store', $product))
        ->assertSuccessful();

    $this->assertDatabaseHas('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

it('removes a wishlist product through json without redirecting the product list', function () {
    $user = User::factory()->create();
    $product = createWishlistProduct(['status' => 'published']);
    Wishlist::query()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $this->actingAs($user)
        ->deleteJson(route('wishlist.products.destroy', $product))
        ->assertSuccessful();

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);
});

it('does not show archived products on the customer wishlist page', function () {
    $user = User::factory()->create();
    $published = createWishlistProduct([
        'name' => 'Published Product',
        'status' => 'published',
    ]);
    $archived = createWishlistProduct([
        'name' => 'Archived Product',
        'status' => 'archived',
    ]);

    Wishlist::query()->create(['user_id' => $user->id, 'product_id' => $published->id]);
    Wishlist::query()->create(['user_id' => $user->id, 'product_id' => $archived->id]);

    $this->actingAs($user)
        ->get(route('my-wishlist'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/wishlist/my-wishlist')
            ->has('wishlistItems', 1)
            ->where('wishlistItems.0.title', 'Published Product')
            ->where('summary.item_count', 1));
});

/**
 * @param  array<string, mixed>  $overrides
 */
function createWishlistProduct(array $overrides = []): Product
{
    $name = (string) ($overrides['name'] ?? 'Product '.Str::random(8));

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
