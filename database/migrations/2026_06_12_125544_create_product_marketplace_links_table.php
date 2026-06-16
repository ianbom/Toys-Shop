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
        Schema::create('product_marketplace_links', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('marketplace_name', 100);
            $table->string('external_product_id', 150)->nullable();
            $table->string('external_sku', 150)->nullable();
            $table->string('product_url');
            $table->decimal('price_snapshot', 15, 2)->nullable();
            $table->integer('stock_snapshot')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('product_id');
            $table->index('marketplace_name');
            $table->unique(['product_id', 'marketplace_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_marketplace_links');
    }
};
