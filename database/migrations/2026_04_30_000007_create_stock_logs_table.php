<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('source', 50)->default('website');
            $table->unsignedBigInteger('desty_sync_job_id')->nullable();
            $table->string('desty_event_id', 150)->nullable();
            $table->string('type', 50);
            $table->integer('quantity');
            $table->integer('stock_before');
            $table->integer('stock_after');
            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('note')->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamps();

            $table->index('product_variant_id');
            $table->index('user_id');
            $table->index('source');
            $table->index('desty_sync_job_id');
            $table->index('type');
            $table->index('reference_type');
            $table->index('reference_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_logs');
    }
};
