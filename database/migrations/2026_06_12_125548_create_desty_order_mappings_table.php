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
        Schema::create('desty_order_mappings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('desty_connection_id')->constrained()->cascadeOnDelete();
            $table->string('desty_order_id', 150)->nullable();
            $table->string('desty_order_number', 150)->nullable();
            $table->string('desty_order_status', 100)->nullable();
            $table->string('sync_status', 50)->default('pending');
            $table->timestamp('last_synced_at')->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('desty_order_id');
            $table->index('sync_status');
            $table->unique(['order_id', 'desty_connection_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desty_order_mappings');
    }
};
