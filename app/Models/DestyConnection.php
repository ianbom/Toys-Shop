<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'vendor_id',
    'api_key_encrypted',
    'access_token_encrypted',
    'refresh_token_encrypted',
    'base_url',
    'sync_mode',
    'is_active',
    'last_connected_at',
    'last_sync_at',
])]
class DestyConnection extends Model
{
    public function orderMappings(): HasMany
    {
        return $this->hasMany(DestyOrderMapping::class);
    }

    public function productMappings(): HasMany
    {
        return $this->hasMany(DestyProductMapping::class);
    }

    public function syncJobs(): HasMany
    {
        return $this->hasMany(DestySyncJob::class);
    }

    public function warehouses(): HasMany
    {
        return $this->hasMany(DestyWarehouse::class);
    }

    public function webhookLogs(): HasMany
    {
        return $this->hasMany(DestyWebhookLog::class);
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_connected_at' => 'datetime',
            'last_sync_at' => 'datetime',
        ];
    }
}
