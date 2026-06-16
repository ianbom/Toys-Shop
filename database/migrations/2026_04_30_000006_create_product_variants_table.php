<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku', 100)->unique();
            $table->string('barcode', 100)->nullable();
            $table->string('variant_name', 180)->default('Default Title');
            $table->string('color_name', 100)->nullable();
            $table->string('color_hex', 20)->nullable();
            $table->string('size', 100)->nullable();
            $table->string('package_type', 150)->nullable();
            $table->decimal('regular_price', 15, 2)->nullable();
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->integer('reserved_stock')->default(0);
            $table->integer('desty_available_stock')->default(0);
            $table->integer('desty_on_hand_stock')->default(0);
            $table->integer('desty_reserved_stock')->default(0);
            $table->timestamp('desty_last_synced_at')->nullable();
            $table->string('stock_source', 50)->default('desty');
            $table->boolean('allow_manual_stock_edit')->default(false);
            $table->integer('weight')->nullable();
            $table->integer('length')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index('product_id');
            $table->index('sku');
            $table->index('color_name');
            $table->index('size');
            $table->index('package_type');
            $table->index('is_active');
            $table->index('stock_source');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
