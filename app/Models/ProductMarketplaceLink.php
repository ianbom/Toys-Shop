<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_id',
    'marketplace_name',
    'external_product_id',
    'external_sku',
    'product_url',
    'price_snapshot',
    'stock_snapshot',
    'last_synced_at',
    'is_active',
])]
class ProductMarketplaceLink extends Model
{
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_synced_at' => 'datetime',
            'price_snapshot' => 'decimal:2',
            'stock_snapshot' => 'integer',
        ];
    }
}
