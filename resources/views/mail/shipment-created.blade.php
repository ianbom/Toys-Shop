@php
    $orderNumber = $order?->order_number ?? '-';
    $recipientName = $recipient['name'] ?? $order?->customer_name ?? 'Customer';
    $courier = strtoupper(trim(($shipment->courier_company ?? '-') . ' ' . ($shipment->courier_type ?? '')));
    $serviceName = $shipment->courier_service_name ?: '-';
    $waybill = $shipment->waybill_id ?: '-';
    $status = str($shipment->shipping_status ?: '-')->replace('_', ' ')->title();
    $estimatedDelivery = $shipment->estimated_delivery ?: '-';
    $shippingCost = 'Rp' . number_format((float) $shipment->shipping_cost, 0, ',', '.');
@endphp

@component('mail::message')
# Order {{ $orderNumber }} sudah siap dikirim

Halo {{ $recipientName }},

Shipment untuk order Anda sudah dibuat. Berikut detail pengiriman dan produk yang dikirim.

@component('mail::panel')
**No. Resi:** {{ $waybill }}

**Status:** {{ $status }}

**Kurir:** {{ $courier }}
@endcomponent

## Data Penerima

**Penerima:** {{ $recipientName }}

**No. Telp:** {{ $recipient['phone'] ?? '-' }}

**Email:** {{ $recipient['email'] ?? '-' }}

@component('mail::table')
| Alamat | Detail |
| :--- | :--- |
| Provinsi | {{ $recipient['province'] ?? '-' }} |
| Kota / Kabupaten | {{ $recipient['city'] ?? '-' }} |
| Kecamatan | {{ $recipient['district'] ?? '-' }} |
| Kelurahan | {{ $recipient['subdistrict'] ?? '-' }} |
| Kode Pos | {{ $recipient['postal_code'] ?? '-' }} |
| Alamat Lengkap | {{ $recipient['address'] ?? '-' }} |
@endcomponent

## Data Shipment

@component('mail::table')
| Data | Detail |
| :--- | :--- |
| Kurir | {{ $courier }} |
| Layanan | {{ $serviceName }} |
| No. Resi | {{ $waybill }} |
| Status | {{ $status }} |
| Estimasi | {{ $estimatedDelivery }} |
| Ongkir | {{ $shippingCost }} |
@endcomponent

## Produk Dikirim

@component('mail::table')
| Produk | SKU / Varian | Qty | Subtotal |
| :--- | :--- | ---: | ---: |
@forelse ($items as $item)
| {{ $item['name'] }} | {{ collect([$item['sku'], $item['variant']])->filter()->implode(' - ') ?: '-' }} | {{ $item['quantity'] }} | Rp{{ number_format($item['subtotal'], 0, ',', '.') }} |
@empty
| - | - | 0 | Rp0 |
@endforelse
@endcomponent

@if ($trackingUrl)
@component('mail::button', ['url' => $trackingUrl])
Lacak Paket
@endcomponent
@endif

@if ($orderUrl)
@component('mail::button', ['url' => $orderUrl, 'color' => 'default'])
Lihat Detail Order
@endcomponent
@endif

Terima kasih,

{{ config('app.name') }}
@endcomponent
