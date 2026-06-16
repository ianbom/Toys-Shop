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
        Schema::create('inventory_reservations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity');
            $table->string('status', 50)->default('reserved');
            $table->timestamp('reserved_at');
            $table->timestamp('released_at')->nullable();
            $table->timestamp('finalized_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('order_item_id');
            $table->index('product_variant_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_reservations');
    }
};
