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
        Schema::create('desty_sync_jobs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('desty_connection_id')->constrained()->cascadeOnDelete();
            $table->string('job_type', 100);
            $table->string('direction', 30);
            $table->string('status', 50)->default('pending');
            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->integer('attempt_count')->default(0);
            $table->integer('max_attempts')->default(3);
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();

            $table->index('desty_connection_id');
            $table->index('job_type');
            $table->index('status');
            $table->index('reference_type');
            $table->index('reference_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desty_sync_jobs');
    }
};
