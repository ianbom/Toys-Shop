<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'name',
    'slug',
    'description',
    'banner_desktop_url',
    'banner_mobile_url',
    'sort_order',
    'is_featured',
    'is_active',
    'starts_at',
    'ends_at',
])]
class Collection extends Model
{
    use SoftDeletes;

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_collections')->withPivot('sort_order')->withTimestamps();
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }
}
