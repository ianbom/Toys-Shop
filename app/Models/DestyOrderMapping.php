<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'order_id',
    'desty_connection_id',
    'desty_order_id',
    'desty_order_number',
    'desty_order_status',
    'sync_status',
    'last_synced_at',
    'raw_payload',
])]
class DestyOrderMapping extends Model
{
    public function connection(): BelongsTo
    {
        return $this->belongsTo(DestyConnection::class, 'desty_connection_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    protected function casts(): array
    {
        return [
            'last_synced_at' => 'datetime',
            'raw_payload' => 'array',
        ];
    }
}
