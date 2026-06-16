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
        Schema::create('desty_warehouses', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('desty_connection_id')->constrained()->cascadeOnDelete();
            $table->string('desty_warehouse_id', 150);
            $table->string('name', 150);
            $table->string('code', 100)->nullable();
            $table->text('address')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->unique(['desty_connection_id', 'desty_warehouse_id']);
            $table->index('is_default');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('desty_warehouses');
    }
};
