<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'order_id',
    'order_item_id',
    'product_variant_id',
    'quantity',
    'status',
    'reserved_at',
    'released_at',
    'finalized_at',
    'expired_at',
])]
class InventoryReservation extends Model
{
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    protected function casts(): array
    {
        return [
            'expired_at' => 'datetime',
            'finalized_at' => 'datetime',
            'quantity' => 'integer',
            'released_at' => 'datetime',
            'reserved_at' => 'datetime',
        ];
    }
}
