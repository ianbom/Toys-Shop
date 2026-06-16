<?php

use App\Mail\ShipmentCreatedMail;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

it('emails the customer when admin creates a shipment from an order', function () {
    Mail::fake();
    config(['services.biteship.api_key' => 'test-key']);

    $admin = User::factory()->create([
        'role' => 'admin',
        'is_active' => true,
    ]);

    $customer = User::factory()->create([
        'name' => 'Siti Aminah',
        'email' => 'siti@example.test',
        'phone' => '081234567890',
    ]);

    seedShipmentSettings();

    $order = Order::query()->create([
        'user_id' => $customer->id,
        'order_number' => 'ORD-EMAIL-001',
        'customer_name' => 'Siti Aminah',
        'customer_email' => 'siti@example.test',
        'customer_phone' => '081234567890',
        'subtotal' => 250000,
        'shipping_cost' => 16000,
        'service_fee' => 0,
        'grand_total' => 266000,
        'payment_status' => 'paid',
        'order_status' => 'paid',
        'shipping_status' => 'not_created',
        'no_return_refund_agreed' => true,
        'no_return_refund_agreed_at' => now(),
        'paid_at' => now(),
    ]);

    OrderAddress::query()->create([
        'order_id' => $order->id,
        'recipient_name' => 'Siti Aminah',
        'recipient_phone' => '081234567890',
        'province' => 'Jawa Barat',
        'city' => 'Bandung',
        'district' => 'Coblong',
        'subdistrict' => 'Dago',
        'postal_code' => '40135',
        'latitude' => -6.894,
        'longitude' => 107.61,
        'full_address' => 'Jl. Dago No. 10, Bandung',
    ]);

    OrderItem::query()->create([
        'order_id' => $order->id,
        'product_name' => 'Khimar Premium',
        'product_sku' => 'KHM-001',
        'variant_sku' => 'KHM-001-BLK-M',
        'color_name' => 'Black',
        'size' => 'M',
        'price' => 250000,
        'quantity' => 1,
        'subtotal' => 250000,
        'weight' => 500,
    ]);

    Http::fake([
        'api.biteship.com/v1/orders' => Http::response([
            'id' => 'btsp-order-1',
            'status' => 'confirmed',
            'courier' => [
                'tracking_id' => 'track-1',
                'waybill_id' => 'JNE123456789',
                'link' => 'https://track.example.test/JNE123456789',
            ],
        ]),
    ]);

    $this->actingAs($admin)
        ->post(route('admin.orders.shipments.store', $order), [
            'courier_company' => 'jne',
            'courier_type' => 'reg',
            'courier_service_name' => 'JNE Reguler',
            'estimated_delivery' => '2-3 hari',
        ])
        ->assertRedirect();

    Mail::assertSent(ShipmentCreatedMail::class, function (ShipmentCreatedMail $mail): bool {
        $html = $mail->render();

        return $mail->hasTo('siti@example.test')
            && str_contains($html, 'Siti Aminah')
            && str_contains($html, 'Jawa Barat')
            && str_contains($html, 'Bandung')
            && str_contains($html, 'Coblong')
            && str_contains($html, 'Dago')
            && str_contains($html, '40135')
            && str_contains($html, 'Jl. Dago No. 10, Bandung')
            && str_contains($html, '081234567890')
            && str_contains($html, 'Khimar Premium')
            && str_contains($html, 'JNE123456789')
            && str_contains($html, 'https://track.example.test/JNE123456789');
    });
});

function seedShipmentSettings(): void
{
    collect([
        'shipper_name' => 'Anemi Store',
        'shipper_phone' => '080000000000',
        'origin_address' => 'Jl. Store No. 1',
        'store_postal_code' => '60111',
        'store_latitude' => '-6.2',
        'store_longitude' => '106.8',
    ])->each(fn (string $value, string $key) => SiteSetting::query()->create([
        'key' => $key,
        'value' => $value,
        'type' => 'string',
    ]));
}
