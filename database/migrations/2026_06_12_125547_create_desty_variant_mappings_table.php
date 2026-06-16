<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('desty_variant_mappings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('desty_product_mapping_id')->constrained()->cascadeOnDelete();
            $table->string('desty_variant_id', 150)->nullable();
            $table->string('desty_sku', 150);
            $table->string('desty_barcode', 150)->nullable();
            $table->string('desty_warehouse_id', 150)->nullable();
            $table->string('sync_status', 50)->default('mapped');
            $table->timestamp('last_stock_synced_at')->nullable();
            $table->timestamps();

            $table->index('product_variant_id');
            $table->index('desty_sku');
            $table->index('sync_status');
            $table->unique(['product_variant_id', 'desty_product_mapping_id'], 'desty_variant_map_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desty_variant_mappings');
    }
};
