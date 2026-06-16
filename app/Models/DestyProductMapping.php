<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'product_id',
    'desty_connection_id',
    'desty_product_id',
    'desty_product_code',
    'desty_product_name',
    'sync_status',
    'last_synced_at',
])]
class DestyProductMapping extends Model
{
    public function connection(): BelongsTo
    {
        return $this->belongsTo(DestyConnection::class, 'desty_connection_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variantMappings(): HasMany
    {
        return $this->hasMany(DestyVariantMapping::class);
    }

    protected function casts(): array
    {
        return [
            'last_synced_at' => 'datetime',
        ];
    }
}
