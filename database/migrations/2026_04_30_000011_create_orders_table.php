<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('customer_address_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_number', 100)->unique();
            $table->string('checkout_idempotency_key', 100)->nullable();
            $table->string('customer_name', 150);
            $table->string('customer_email', 191);
            $table->string('customer_phone', 30);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->decimal('insurance_cost', 15, 2)->default(0);
            $table->decimal('service_fee', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->foreignId('voucher_id')->nullable()->constrained()->nullOnDelete();
            $table->string('voucher_code', 50)->nullable();
            $table->string('payment_status', 50)->default('pending');
            $table->string('order_status', 50)->default('pending_payment');
            $table->string('shipping_status', 50)->default('not_created');
            $table->string('source_channel', 50)->default('website');
            $table->string('desty_sync_status', 50)->default('not_synced');
            $table->timestamp('desty_synced_at')->nullable();
            $table->boolean('no_return_refund_agreed')->default(false);
            $table->timestamp('no_return_refund_agreed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('stock_reserved_at')->nullable();
            $table->timestamp('stock_released_at')->nullable();
            $table->timestamp('stock_finalized_at')->nullable();
            $table->timestamp('voucher_released_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'checkout_idempotency_key']);
            $table->index('order_number');
            $table->index('payment_status');
            $table->index('order_status');
            $table->index('shipping_status');
            $table->index('source_channel');
            $table->index('desty_sync_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
