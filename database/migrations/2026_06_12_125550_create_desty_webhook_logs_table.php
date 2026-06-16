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
        Schema::create('desty_webhook_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('desty_connection_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type', 150)->nullable();
            $table->string('event_id', 150)->nullable();
            $table->string('payload_hash', 64)->nullable()->unique();
            $table->json('payload');
            $table->string('processed_status', 50)->default('pending');
            $table->timestamp('processed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index('desty_connection_id');
            $table->index('event_type');
            $table->index('event_id');
            $table->index('processed_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desty_webhook_logs');
    }
};
