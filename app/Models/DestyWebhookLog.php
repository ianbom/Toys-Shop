<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'desty_connection_id',
    'event_type',
    'event_id',
    'payload_hash',
    'payload',
    'processed_status',
    'processed_at',
    'error_message',
])]
class DestyWebhookLog extends Model
{
    public function connection(): BelongsTo
    {
        return $this->belongsTo(DestyConnection::class, 'desty_connection_id');
    }

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'processed_at' => 'datetime',
        ];
    }
}
