<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->string('sku', 100)->nullable()->unique();
            $table->string('brand_name', 150)->default('Axegear');
            $table->string('product_line', 150)->nullable();
            $table->string('style_name', 180)->nullable();
            $table->decimal('regular_price', 15, 2);
            $table->decimal('sale_price', 15, 2)->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();
            $table->string('stock_status', 50)->default('in_stock');
            $table->string('status', 30)->default('draft');
            $table->integer('weight')->default(0);
            $table->integer('length')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new_arrival')->default(false);
            $table->boolean('is_best_seller')->default(false);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('category_id');
            $table->index('sku');
            $table->index('brand_name');
            $table->index('product_line');
            $table->index('stock_status');
            $table->index('status');
            $table->index('is_featured');
            $table->index('is_new_arrival');
            $table->index('is_best_seller');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
