import { Head, Link } from '@inertiajs/react';
import type { Icon, LatLngBoundsExpression, Map as LeafletMap } from 'leaflet';
import { Lock, MapPinned, ShieldCheck, Ticket, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type * as ReactLeaflet from 'react-leaflet';
import { toast } from 'sonner';
import { CheckoutProvider, useCheckout } from '@/contexts/checkout-context';
import type {
    CheckoutAddress,
    CheckoutItem,
    CheckoutStoreLocation,
    CheckoutSummary,
    ShippingRate,
    Voucher,
} from '@/contexts/checkout-context';
import ShopLayout from '@/layouts/shop-layout';

type Props = {
    addresses: CheckoutAddress[];
    appliedVoucher: Voucher;
    cartItems: CheckoutItem[];
    defaultAddressId: number | null;
    selectedShippingRate: ShippingRate | null;
    storeLocation: CheckoutStoreLocation;
    summary: CheckoutSummary;
};

type ReactLeafletModules = {
    MapContainer: typeof ReactLeaflet.MapContainer;
    Marker: typeof ReactLeaflet.Marker;
    Polyline: typeof ReactLeaflet.Polyline;
    Popup: typeof ReactLeaflet.Popup;
    TileLayer: typeof ReactLeaflet.TileLayer;
    useMap: typeof ReactLeaflet.useMap;
};

type Coordinates = [number, number];

const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(price)
        .replace('Rp', 'Rp ');

const formatWeight = (grams: number) => {
    if (grams >= 1000) {
        return `${new Intl.NumberFormat('id-ID', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
        }).format(grams / 1000)} kg`;
    }

    return `${new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
    }).format(grams)} gram`;
};

const formatDistance = (meters: number) =>
    meters >= 1000
        ? `${new Intl.NumberFormat('id-ID', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
          }).format(meters / 1000)} km`
        : `${new Intl.NumberFormat('id-ID', {
              maximumFractionDigits: 0,
          }).format(meters)} m`;

const checkoutStockAlertKey = 'checkout.stock_alert';

const stockIssueMessage = (item: CheckoutItem) => {
    if (item.available_stock <= 0) {
        return 'Produk sudah habis. Tidak bisa checkout.';
    }

    if (item.available_stock < item.quantity) {
        return `Stok tidak mencukupi. Tersedia ${item.available_stock}, di keranjang ${item.quantity}.`;
    }

    return 'Produk tidak tersedia. Tidak bisa checkout.';
};

const validCoordinates = (latitude: number, longitude: number): boolean =>
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

const coordinatesFrom = (
    location: Pick<
        CheckoutAddress | CheckoutStoreLocation,
        'latitude' | 'longitude'
    >,
): Coordinates | null => {
    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    return validCoordinates(latitude, longitude) ? [latitude, longitude] : null;
};

const distanceMeters = (from: Coordinates, to: Coordinates) => {
    const earthRadiusMeters = 6371000;
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const latitudeDelta = toRadians(to[0] - from[0]);
    const longitudeDelta = toRadians(to[1] - from[1]);
    const fromLatitude = toRadians(from[0]);
    const toLatitude = toRadians(to[0]);
    const haversine =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(fromLatitude) *
            Math.cos(toLatitude) *
            Math.sin(longitudeDelta / 2) ** 2;

    return Math.round(
        earthRadiusMeters *
            2 *
            Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)),
    );
};

const googleMapsDirectionsUrl = (from: Coordinates, to: Coordinates) => {
    const origin = `${from[0]},${from[1]}`;
    const destination = `${to[0]},${to[1]}`;
    const params = new URLSearchParams({
        api: '1',
        origin,
        destination,
        travelmode: 'driving',
    });

    return `https://www.google.com/maps/dir/?${params.toString()}`;
};

export default function Checkout(props: Props) {
    return (
        <CheckoutProvider {...props}>
            <CheckoutScreen />
        </CheckoutProvider>
    );
}

function CheckoutScreen() {
    const {
        addresses,
        appliedVoucher,
        applyVoucher,
        cartItems,
        errors,
        loadShippingRates,
        placeOrder,
        placingOrder,
        removeVoucher,
        selectAddress,
        selectShippingRate,
        selectedAddressId,
        selectedShippingRate,
        shippingRates,
        shippingRatesLoading,
        storeLocation,
        summary,
    } = useCheckout();
    const [voucherCode, setVoucherCode] = useState(appliedVoucher?.code ?? '');
    const [notes, setNotes] = useState('');
    const [agreed, setAgreed] = useState(false);
    const totalWeight = cartItems.reduce(
        (total, item) => total + item.weight,
        0,
    );
    const selectedAddress =
        addresses.find((address) => address.id === selectedAddressId) ?? null;
    const storeCoordinates = coordinatesFrom(storeLocation);
    const destinationCoordinates = selectedAddress
        ? coordinatesFrom(selectedAddress)
        : null;
    const routeDistance =
        storeCoordinates && destinationCoordinates
            ? distanceMeters(storeCoordinates, destinationCoordinates)
            : null;
    const unavailableItems = cartItems.filter((item) => !item.is_available);
    const hasUnavailableItems = unavailableItems.length > 0;

    useEffect(() => {
        if (selectedAddressId && shippingRates.length === 0) {
            void loadShippingRates(selectedAddressId, {
                preserveSelectedRate: true,
            });
        }
    }, [loadShippingRates, selectedAddressId, shippingRates.length]);

    useEffect(() => {
        const message = window.sessionStorage.getItem(checkoutStockAlertKey);

        if (!message) {
            return;
        }

        window.sessionStorage.removeItem(checkoutStockAlertKey);
        toast.error(message);
    }, []);

    const submitOrder = async () => {
        if (hasUnavailableItems) {
            window.sessionStorage.setItem(
                checkoutStockAlertKey,
                'Produk sudah habis atau stok tidak mencukupi. Perbarui keranjang sebelum membayar.',
            );
            window.location.reload();

            return;
        }

        const redirectUrl = await placeOrder(notes, agreed);

        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    };

    return (
        <ShopLayout>
            <Head title="Checkout - AxeGear" />

            <main className="mx-auto min-h-screen max-w-[1320px] px-4 py-7 md:px-6 lg:px-8 lg:py-10">
                <div className="mb-8 flex items-center gap-2 text-[12px] font-semibold tracking-[0.02em] text-[#707070] uppercase md:text-[13px]">
                    <Link
                        href="/"
                        className="transition-colors hover:text-black"
                    >
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link
                        href="/my-cart"
                        className="transition-colors hover:text-black"
                    >
                        Keranjang
                    </Link>
                    <span>/</span>
                    <span className="font-extrabold text-[#1A1A1A]">
                        Checkout
                    </span>
                </div>

                <div className="mb-8 flex min-w-0 flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div className="min-w-0">
                        <h1 className="text-[42px] leading-none font-black tracking-[-0.03em] text-[#1A1A1A] uppercase italic md:text-[68px] lg:text-[82px]">
                            Checkout
                        </h1>
                        <p className="mt-3 max-w-[560px] text-sm leading-6 font-medium text-[#707070] md:text-base">
                            Pilih alamat tersimpan, ongkir Biteship, voucher,
                            lalu bayar via Midtrans.
                        </p>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="border border-[#CFCFCF] bg-white p-10 text-center">
                        <p className="mb-4 text-2xl font-black tracking-[-0.01em] text-[#1A1A1A] uppercase">
                            Keranjang kosong
                        </p>
                        <Link
                            href="/list"
                            className="text-sm font-black tracking-[0.04em] text-[#F58220] uppercase underline"
                        >
                            Belanja dulu
                        </Link>
                    </div>
                ) : (
                    <div className="relative grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,390px)] lg:gap-8 xl:gap-10">
                        <div className="min-w-0 flex-1 space-y-8 md:space-y-10">
                            <section className="border-b border-[#CFCFCF] pb-8">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-black tracking-[0.02em] text-[#1A1A1A] uppercase">
                                            Alamat Pengiriman
                                        </h2>
                                    </div>
                                    <Link
                                        href="/address?redirect_to=/checkout"
                                        className="text-[12px] font-black tracking-[0.04em] text-[#F58220] uppercase hover:text-[#E67312]"
                                    >
                                        Kelola alamat
                                    </Link>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {addresses.map((address) => (
                                        <button
                                            key={address.id}
                                            type="button"
                                            onClick={() =>
                                                void selectAddress(address.id)
                                            }
                                            className={`border p-4 text-left transition-all ${selectedAddressId === address.id ? 'border-[#F58220] bg-[#FFF3E8] ring-1 ring-[#F58220]' : 'border-[#CFCFCF] bg-white hover:border-[#1A1A1A]'}`}
                                        >
                                            <div className="mb-2 flex items-start justify-between gap-3">
                                                <p className="text-[13px] font-black tracking-[0.03em] text-[#1A1A1A] uppercase">
                                                    {address.label ?? 'Alamat'}
                                                </p>
                                                {address.is_default && (
                                                    <span className="bg-[#F58220] px-2 py-1 text-[10px] font-black tracking-[0.04em] text-white uppercase">
                                                        Utama
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[12px] font-bold text-[#2E2E2E]">
                                                {address.recipient_name}
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#707070]">
                                                {address.recipient_phone}
                                            </p>
                                            <p className="mt-2 text-[12px] leading-relaxed text-[#707070]">
                                                {address.full_address}
                                            </p>
                                            {(!address.postal_code ||
                                                !address.latitude ||
                                                !address.longitude) && (
                                                <p className="mt-2 text-[11px] font-semibold text-[#C81E1E]">
                                                    Lengkapi kode pos dan
                                                    koordinat di buku alamat.
                                                </p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="border-b border-[#CFCFCF] pb-8">
                                <div className="mb-5 flex items-center gap-2">
                                    <Truck
                                        size={18}
                                        className="text-[#F58220]"
                                        strokeWidth={1.5}
                                    />
                                    <h2 className="text-xl font-black tracking-[0.02em] text-[#1A1A1A] uppercase">
                                        Ongkir
                                    </h2>
                                </div>
                                {errors.shipping && (
                                    <p className="mb-3 text-[12px] font-semibold text-[#C81E1E]">
                                        {errors.shipping}
                                    </p>
                                )}
                                {errors.customer_address_id && (
                                    <p className="mb-3 text-[12px] font-semibold text-[#C81E1E]">
                                        {errors.customer_address_id}
                                    </p>
                                )}
                                {shippingRatesLoading ? (
                                    <div className="border border-dashed border-[#CFCFCF] bg-[#F8F8F8] p-6 text-[12px] font-semibold text-[#707070]">
                                        Memuat harga ongkir...
                                    </div>
                                ) : shippingRates.length === 0 ? (
                                    <div className="border border-dashed border-[#CFCFCF] bg-[#F8F8F8] p-6 text-[12px] font-semibold text-[#707070]">
                                        Pilih alamat dengan kode pos dan
                                        koordinat untuk melihat harga ongkir.
                                    </div>
                                ) : (
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {shippingRates.map((rate) => (
                                            <button
                                                key={rate.id}
                                                type="button"
                                                onClick={() =>
                                                    void selectShippingRate(
                                                        rate,
                                                    )
                                                }
                                                className={`border p-4 text-left transition-all ${selectedShippingRate?.id === rate.id ? 'border-[#F58220] bg-[#FFF3E8] ring-1 ring-[#F58220]' : 'border-[#CFCFCF] bg-white hover:border-[#1A1A1A]'}`}
                                            >
                                                <p className="text-[13px] font-black tracking-[0.03em] text-[#1A1A1A] uppercase">
                                                    {rate.courier_company.toUpperCase()}{' '}
                                                    {rate.courier_type}
                                                </p>
                                                <p className="mt-1 text-[11px] font-medium text-[#707070]">
                                                    {rate.courier_service_name ??
                                                        rate.description ??
                                                        'Layanan pengiriman'}{' '}
                                                    · {rate.duration ?? '-'}
                                                </p>
                                                <p className="mt-3 text-[16px] font-black text-[#F58220]">
                                                    {formatPrice(rate.price)}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="border-b border-[#CFCFCF] pb-8">
                                <div className="mb-5 flex items-center gap-2">
                                    <Ticket
                                        size={18}
                                        className="text-[#F58220]"
                                        strokeWidth={1.5}
                                    />
                                    <h2 className="text-xl font-black tracking-[0.02em] text-[#1A1A1A] uppercase">
                                        Voucher
                                    </h2>
                                </div>
                                <div className="flex min-w-0 flex-wrap gap-2 sm:flex-nowrap">
                                    <input
                                        value={voucherCode}
                                        onChange={(event) =>
                                            setVoucherCode(event.target.value)
                                        }
                                        placeholder="Masukkan kode voucher"
                                        className="h-12 min-w-[180px] flex-1 border border-[#CFCFCF] bg-white px-4 text-[13px] font-semibold text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:border-[#1A1A1A] focus:ring-0 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void applyVoucher(voucherCode)
                                        }
                                        className="h-12 bg-[#F58220] px-6 text-[12px] font-black tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#E67312] active:bg-[#CC5F08]"
                                    >
                                        Pakai
                                    </button>
                                    {appliedVoucher && (
                                        <button
                                            type="button"
                                            onClick={() => void removeVoucher()}
                                            className="h-12 border border-[#1A1A1A] px-4 text-[12px] font-black tracking-[0.06em] text-[#1A1A1A] uppercase hover:bg-[#1A1A1A] hover:text-white"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                                {appliedVoucher && (
                                    <p className="mt-2 text-[12px] font-black text-[#F58220]">
                                        {appliedVoucher.name}: -
                                        {formatPrice(appliedVoucher.discount)}
                                    </p>
                                )}
                                {errors.voucher_code && (
                                    <p className="mt-2 text-[12px] font-semibold text-[#C81E1E]">
                                        {errors.voucher_code}
                                    </p>
                                )}
                            </section>

                            <section className="border-b border-[#CFCFCF] pb-8">
                                <h2 className="mb-4 text-xl font-black tracking-[0.02em] text-[#1A1A1A] uppercase">
                                    Catatan Order
                                </h2>
                                <textarea
                                    value={notes}
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                    maxLength={2000}
                                    placeholder="Opsional"
                                    className="h-28 w-full resize-none border border-[#CFCFCF] bg-white px-4 py-3 text-[13px] font-medium text-[#1A1A1A] placeholder:text-[#9A9A9A] focus:border-[#1A1A1A] focus:ring-0 focus:outline-none"
                                />
                                <label className="mt-4 flex items-start gap-3 text-[12px] leading-5 font-medium text-[#707070]">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(event) =>
                                            setAgreed(event.target.checked)
                                        }
                                        className="mt-0.5 h-4 w-4 border-[#1A1A1A] text-[#F58220] focus:ring-[#F58220]"
                                    />
                                    <span>
                                        Saya menyetujui kebijakan tanpa
                                        retur/refund, Syarat & Ketentuan, dan
                                        Kebijakan Privasi.
                                    </span>
                                </label>
                                {errors.no_return_refund_agreed && (
                                    <p className="mt-2 text-[12px] font-semibold text-[#C81E1E]">
                                        {errors.no_return_refund_agreed}
                                    </p>
                                )}
                                {errors.checkout && (
                                    <p className="mt-2 text-[12px] font-semibold text-[#C81E1E]">
                                        {errors.checkout}
                                    </p>
                                )}
                            </section>
                        </div>

                        <aside className="w-full min-w-0">
                            <div className="sticky top-24 lg:top-32">
                                <h2 className="mb-6 text-xl font-black tracking-[0.02em] text-[#1A1A1A] uppercase md:text-2xl">
                                    Ringkasan Pesanan
                                </h2>
                                <div className="mb-6 max-h-[340px] space-y-4 overflow-y-auto border-b border-[#CFCFCF] pr-2 pb-5">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3"
                                        >
                                            <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-[#E5E5E5] bg-[#F8F8F8]">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="h-full w-full object-contain p-2"
                                                    />
                                                )}
                                                <span className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center bg-[#1A1A1A] px-1 text-[10px] font-black text-white">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13px] leading-4 font-black text-[#1A1A1A] uppercase">
                                                    {item.title}
                                                </p>
                                                <p className="mt-1 text-[11px] font-medium text-[#707070]">
                                                    {[item.color, item.size]
                                                        .filter(Boolean)
                                                        .join(' / ') || '-'}
                                                </p>
                                                <p className="mt-1 text-[11px] font-semibold text-[#707070]">
                                                    Berat:{' '}
                                                    {formatWeight(item.weight)}
                                                </p>
                                                {!item.is_available && (
                                                    <p className="mt-1 text-[10px] font-bold text-[#C81E1E]">
                                                        {stockIssueMessage(
                                                            item,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="max-w-[98px] shrink-0 text-right text-[12px] font-black break-words text-[#1A1A1A] tabular-nums md:max-w-[112px]">
                                                {formatPrice(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <SummaryRow
                                    label="Subtotal"
                                    value={summary.subtotal}
                                />
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold text-[#707070]">
                                    <span>Total Berat</span>
                                    <span className="text-right font-black break-words tabular-nums">
                                        {formatWeight(totalWeight)}
                                    </span>
                                </div>
                                <SummaryRow
                                    label="Ongkir"
                                    value={summary.shipping}
                                />
                                <SummaryRow
                                    label="Biaya Layanan"
                                    value={summary.service_fee}
                                />
                                <SummaryRow
                                    label="Diskon"
                                    value={-summary.discount}
                                    danger
                                />
                                {hasUnavailableItems && (
                                    <div className="mt-4 border border-[#C81E1E] bg-[#FFF6F6] px-4 py-3 text-[12px] font-bold text-[#C81E1E]">
                                        Ada item yang stoknya tidak tersedia.
                                        Perbarui keranjang sebelum checkout.
                                    </div>
                                )}
                                <div className="mt-5 border-t-2 border-[#1A1A1A] pt-5">
                                    <div className="flex flex-wrap items-end justify-between gap-2">
                                        <span className="text-[13px] font-black tracking-[0.04em] text-[#1A1A1A] uppercase">
                                            Total Pembayaran
                                        </span>
                                        <span className="text-right text-2xl font-black tracking-[-0.03em] break-words text-[#1A1A1A] tabular-nums md:text-[28px]">
                                            {formatPrice(summary.total)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => void submitOrder()}
                                    disabled={
                                        placingOrder ||
                                        !selectedShippingRate ||
                                        !agreed
                                    }
                                    className="mt-6 flex h-14 w-full items-center justify-center bg-[#F58220] text-[13px] font-black tracking-[0.08em] text-white uppercase transition-all hover:bg-[#E67312] active:scale-[0.98] active:bg-[#CC5F08] disabled:cursor-not-allowed disabled:bg-[#CFCFCF] disabled:text-[#707070]"
                                >
                                    <Lock size={16} className="mr-2" />
                                    {placingOrder
                                        ? 'Membuat Pembayaran...'
                                        : 'Bayar dengan Midtrans'}
                                </button>
                                <div className="mt-8 space-y-4 border-t border-[#CFCFCF] pt-6">
                                    <CheckoutRouteMap
                                        destinationAddress={selectedAddress}
                                        destinationCoordinates={
                                            destinationCoordinates
                                        }
                                        distance={routeDistance}
                                        storeCoordinates={storeCoordinates}
                                    />
                                    <div className="border border-[#CFCFCF] bg-white p-4">
                                        <div className="flex items-start gap-3 text-[12px] font-bold text-[#1A1A1A]">
                                            <ShieldCheck
                                                size={16}
                                                className="mt-0.5 shrink-0 text-[#F58220]"
                                                strokeWidth={1.5}
                                            />
                                            <p>
                                                Pembayaran aman didukung
                                                Midtrans
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border border-[#CFCFCF] bg-white p-4">
                                        <div className="flex items-start gap-3 text-[12px] font-bold text-[#1A1A1A]">
                                            <Truck
                                                size={16}
                                                className="mt-0.5 shrink-0 text-[#F58220]"
                                                strokeWidth={1.5}
                                            />
                                            <p>Ongkir dihitung oleh Biteship</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </ShopLayout>
    );
}

function CheckoutRouteMap({
    destinationAddress,
    destinationCoordinates,
    distance,
    storeCoordinates,
}: {
    destinationAddress: CheckoutAddress | null;
    destinationCoordinates: Coordinates | null;
    distance: number | null;
    storeCoordinates: Coordinates | null;
}) {
    const [leafletModules, setLeafletModules] =
        useState<ReactLeafletModules | null>(null);
    const [markerIcon, setMarkerIcon] = useState<Icon | null>(null);
    const canShowRoute = Boolean(
        storeCoordinates && destinationCoordinates && distance !== null,
    );
    const googleMapsUrl =
        storeCoordinates && destinationCoordinates
            ? googleMapsDirectionsUrl(storeCoordinates, destinationCoordinates)
            : null;

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            import('leaflet'),
            import('leaflet/dist/leaflet.css'),
            import('react-leaflet'),
        ]).then(([leaflet, , reactLeaflet]) => {
            if (!isMounted) {
                return;
            }

            setMarkerIcon(
                leaflet.icon({
                    iconUrl:
                        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl:
                        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl:
                        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                }),
            );
            setLeafletModules({
                MapContainer: reactLeaflet.MapContainer,
                Marker: reactLeaflet.Marker,
                Polyline: reactLeaflet.Polyline,
                Popup: reactLeaflet.Popup,
                TileLayer: reactLeaflet.TileLayer,
                useMap: reactLeaflet.useMap,
            });
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="border border-[#CFCFCF] bg-white p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="flex items-center gap-2 text-[12px] font-black tracking-[0.06em] text-[#1A1A1A] uppercase">
                        <MapPinned size={15} className="text-[#F58220]" />
                        Rute Pengiriman
                    </p>
                </div>
                {distance !== null && (
                    <span className="border border-[#1A1A1A] bg-white px-2.5 py-1 text-[10px] font-black text-[#1A1A1A] uppercase">
                        {formatDistance(distance)}
                    </span>
                )}
            </div>

            {canShowRoute && leafletModules && markerIcon ? (
                <RouteMap
                    destinationAddress={destinationAddress}
                    destinationCoordinates={
                        destinationCoordinates as Coordinates
                    }
                    markerIcon={markerIcon}
                    modules={leafletModules}
                    storeCoordinates={storeCoordinates as Coordinates}
                />
            ) : (
                <div className="flex h-[220px] items-center justify-center border border-dashed border-[#CFCFCF] bg-[#F8F8F8] px-5 text-center text-[11px] font-bold text-[#707070]">
                    {!storeCoordinates
                        ? 'Koordinat toko belum dikonfigurasi.'
                        : !destinationCoordinates
                          ? 'Pilih alamat dengan koordinat untuk melihat rute.'
                          : 'Memuat peta...'}
                </div>
            )}

            {canShowRoute && (
                <div className="mt-3 space-y-3">
                    {googleMapsUrl && (
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-11 w-full items-center justify-center bg-[#F58220] px-3 text-[11px] font-black tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#E67312]"
                        >
                            Buka rute di Google Maps
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

function RouteMap({
    destinationAddress,
    destinationCoordinates,
    markerIcon,
    modules,
    storeCoordinates,
}: {
    destinationAddress: CheckoutAddress | null;
    destinationCoordinates: Coordinates;
    markerIcon: Icon;
    modules: ReactLeafletModules;
    storeCoordinates: Coordinates;
}) {
    const { MapContainer, Marker, Polyline, Popup, TileLayer } = modules;
    const bounds: LatLngBoundsExpression = [
        storeCoordinates,
        destinationCoordinates,
    ];

    return (
        <div className="overflow-hidden border border-[#CFCFCF] bg-white">
            <MapContainer
                bounds={bounds}
                className="h-[220px] w-full"
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RouteMapUpdater bounds={bounds} modules={modules} />
                <Polyline
                    pathOptions={{ color: '#F58220', weight: 4 }}
                    positions={[storeCoordinates, destinationCoordinates]}
                />
                <Marker icon={markerIcon} position={storeCoordinates}>
                    <Popup>Lokasi toko</Popup>
                </Marker>
                <Marker icon={markerIcon} position={destinationCoordinates}>
                    <Popup>
                        {destinationAddress?.label ?? 'Alamat pengiriman'}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

function RouteMapUpdater({
    bounds,
    modules,
}: {
    bounds: LatLngBoundsExpression;
    modules: ReactLeafletModules;
}) {
    const map = modules.useMap() as LeafletMap;

    useEffect(() => {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 });
    }, [bounds, map]);

    return null;
}

function SummaryRow({
    label,
    value,
    danger = false,
}: {
    label: string;
    value: number;
    danger?: boolean;
}) {
    return (
        <div
            className={`mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold ${danger ? 'text-[#F58220]' : 'text-[#707070]'}`}
        >
            <span>{label}</span>
            <span className="text-right font-black break-words tabular-nums">
                {value < 0 ? '-' : ''}
                {formatPrice(Math.abs(value))}
            </span>
        </div>
    );
}
