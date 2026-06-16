<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'product_variant_id',
    'desty_product_mapping_id',
    'desty_variant_id',
    'desty_sku',
    'desty_barcode',
    'desty_warehouse_id',
    'sync_status',
    'last_stock_synced_at',
])]
class DestyVariantMapping extends Model
{
    public function productMapping(): BelongsTo
    {
        return $this->belongsTo(DestyProductMapping::class, 'desty_product_mapping_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    protected function casts(): array
    {
        return [
            'last_stock_synced_at' => 'datetime',
        ];
    }
}
