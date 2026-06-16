<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable([
    'desty_connection_id',
    'job_type',
    'direction',
    'status',
    'reference_type',
    'reference_id',
    'attempt_count',
    'max_attempts',
    'request_payload',
    'response_payload',
    'error_message',
    'started_at',
    'finished_at',
])]
class DestySyncJob extends Model
{
    public function connection(): BelongsTo
    {
        return $this->belongsTo(DestyConnection::class, 'desty_connection_id');
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function stockLogs(): HasMany
    {
        return $this->hasMany(StockLog::class);
    }

    protected function casts(): array
    {
        return [
            'attempt_count' => 'integer',
            'finished_at' => 'datetime',
            'max_attempts' => 'integer',
            'request_payload' => 'array',
            'response_payload' => 'array',
            'started_at' => 'datetime',
        ];
    }
}
