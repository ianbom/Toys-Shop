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
        Schema::create('desty_product_mappings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('desty_connection_id')->constrained()->cascadeOnDelete();
            $table->string('desty_product_id', 150);
            $table->string('desty_product_code', 150)->nullable();
            $table->string('desty_product_name')->nullable();
            $table->string('sync_status', 50)->default('mapped');
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->index('product_id');
            $table->index('desty_product_id');
            $table->index('sync_status');
            $table->unique(['product_id', 'desty_connection_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desty_product_mappings');
    }
};
