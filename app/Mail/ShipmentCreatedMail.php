<?php

namespace App\Mail;

use App\Models\Shipment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;

class ShipmentCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Shipment $shipment)
    {
        $this->shipment->loadMissing(['order.address', 'order.items']);
    }

    public function envelope(): Envelope
    {
        $orderNumber = $this->shipment->order?->order_number;

        return new Envelope(
            subject: $orderNumber
                ? "Shipment order {$orderNumber} sudah dibuat"
                : 'Shipment order sudah dibuat',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.shipment-created',
            with: [
                'order' => $this->shipment->order,
                'shipment' => $this->shipment,
                'recipient' => $this->recipientData(),
                'items' => $this->itemsData(),
                'trackingUrl' => $this->trackingUrl(),
                'orderUrl' => $this->orderUrl(),
            ],
        );
    }

    /**
     * @return array{name: ?string, phone: ?string, email: ?string, province: ?string, city: ?string, district: ?string, subdistrict: ?string, postal_code: ?string, address: ?string}
     */
    private function recipientData(): array
    {
        $order = $this->shipment->order;
        $address = $order?->address;

        return [
            'name' => $address?->recipient_name ?: $order?->customer_name,
            'phone' => $address?->recipient_phone ?: $order?->customer_phone,
            'email' => $order?->customer_email,
            'province' => $address?->province,
            'city' => $address?->city,
            'district' => $address?->district,
            'subdistrict' => $address?->subdistrict,
            'postal_code' => $address?->postal_code,
            'address' => $address?->full_address,
        ];
    }

    private function itemsData(): array
    {
        return $this->shipment->order?->items
            ->map(fn ($item): array => [
                'name' => $item->product_name,
                'sku' => $item->variant_sku ?: $item->product_sku,
                'variant' => collect([$item->color_name, $item->size])->filter()->implode(' / '),
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
                'subtotal' => (float) $item->subtotal,
            ])
            ->values()
            ->all() ?? [];
    }

    private function trackingUrl(): ?string
    {
        foreach ([
            'courier.link',
            'courier.tracking_link',
            'tracking.link',
            'tracking.url',
            'tracking_url',
            'public_tracking_url',
            'label_url',
        ] as $key) {
            $url = $key === 'label_url'
                ? $this->shipment->label_url
                : Arr::get($this->shipment->raw_order_response ?? [], $key);

            if (is_string($url) && filled($url)) {
                return $url;
            }
        }

        return null;
    }

    private function orderUrl(): ?string
    {
        $order = $this->shipment->order;

        return $order ? route('order.detail', $order) : null;
    }
}
