<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'order_id',
    'product_id',
    'product_variant_id',
    'product_name',
    'product_sku',
    'variant_sku',
    'variant_name',
    'color_name',
    'size',
    'package_type',
    'price',
    'quantity',
    'subtotal',
    'weight',
    'length',
    'width',
    'height',
    'product_image_url',
])]
class OrderItem extends Model
{
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function inventoryReservations(): HasMany
    {
        return $this->hasMany(InventoryReservation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    protected function casts(): array
    {
        return [
            'height' => 'integer',
            'length' => 'integer',
            'price' => 'decimal:2',
            'quantity' => 'integer',
            'subtotal' => 'decimal:2',
            'weight' => 'integer',
            'width' => 'integer',
        ];
    }
}
