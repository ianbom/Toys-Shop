<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'category_id',
    'name',
    'slug',
    'sku',
    'brand_name',
    'product_line',
    'style_name',
    'regular_price',
    'sale_price',
    'short_description',
    'description',
    'stock_status',
    'weight',
    'length',
    'width',
    'height',
    'status',
    'is_featured',
    'is_new_arrival',
    'is_best_seller',
    'meta_title',
    'meta_description',
])]
class Product extends Model
{
    use SoftDeletes;

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class, 'product_collections')->withPivot('sort_order')->withTimestamps();
    }

    public function destyMappings(): HasMany
    {
        return $this->hasMany(DestyProductMapping::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function marketplaceLinks(): HasMany
    {
        return $this->hasMany(ProductMarketplaceLink::class);
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    protected function casts(): array
    {
        return [
            'height' => 'integer',
            'is_best_seller' => 'boolean',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'length' => 'integer',
            'regular_price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'weight' => 'integer',
            'width' => 'integer',
        ];
    }
}
