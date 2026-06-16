<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'desty_connection_id',
    'desty_warehouse_id',
    'name',
    'code',
    'address',
    'is_default',
    'is_active',
    'last_synced_at',
])]
class DestyWarehouse extends Model
{
    public function connection(): BelongsTo
    {
        return $this->belongsTo(DestyConnection::class, 'desty_connection_id');
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }
}
