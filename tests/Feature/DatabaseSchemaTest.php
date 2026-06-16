<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

it('matches the ecommerce database specification', function () {
    foreach ([
        'product_collections',
        'product_marketplace_links',
        'desty_connections',
        'desty_warehouses',
        'desty_product_mappings',
        'desty_variant_mappings',
        'desty_order_mappings',
        'desty_sync_jobs',
        'desty_webhook_logs',
        'inventory_reservations',
        'voucher_products',
        'voucher_categories',
        'product_reviews',
    ] as $table) {
        expect(Schema::hasTable($table))->toBeTrue($table.' table is missing');
    }

    expect(Schema::hasColumns('products', [
        'brand_name',
        'product_line',
        'style_name',
        'regular_price',
        'stock_status',
    ]))->toBeTrue();

    expect(Schema::hasColumns('product_variants', [
        'barcode',
        'variant_name',
        'package_type',
        'regular_price',
        'desty_available_stock',
        'desty_on_hand_stock',
        'desty_reserved_stock',
        'desty_last_synced_at',
        'stock_source',
        'allow_manual_stock_edit',
    ]))->toBeTrue();

    expect(Schema::hasColumns('orders', [
        'insurance_cost',
        'source_channel',
        'desty_sync_status',
        'desty_synced_at',
    ]))->toBeTrue();
});
