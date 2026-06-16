import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    ChevronLeft,
    FileText,
    Info,
    Minus,
    Plus,
    RotateCcw,
    ShieldCheck,
    Trash2,
    Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
    removeCartItem,
    updateCartItemQuantity,
} from '@/actions/App/Http/Controllers/Customer/CartController';
import ShopLayout from '@/layouts/shop-layout';
import { checkout, detail, list } from '@/routes';

type CartItem = {
    id: number;
    product_id: number | null;
    product_slug: string | null;
    title: string;
    color: string | null;
    color_hex: string | null;
    size: string | null;
    image: string | null;
    price: number;
    quantity: number;
    available_stock: number;
    is_available: boolean;
    variant: {
        id: number | null;
        sku: string | null;
    };
    subtotal: number;
};

type CartSummary = {
    item_count: number;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
};

type SuggestedProduct = {
    id: number;
    slug: string;
    title: string;
    price: number;
    image: string | null;
    available_stock: number;
};

type PageProps = {
    cartItems: CartItem[];
    summary: CartSummary;
    suggestedProducts: SuggestedProduct[];
};

const fallbackImages = [
    'https://www.100percent.com/cdn/shop/files/59057-00001-P_1.jpg?v=1764788225&width=1100',
    'https://www.100percent.com/cdn/shop/files/SP26_SPEEDCRAFT_SL_60008-00025_3Q.jpg?v=1772487312&width=500',
    'https://www.100percent.com/cdn/shop/files/2000x2000-eComm_20PDP-Casual_Staple_20Tee_0010_Layer_2015.jpg?v=1764633157&width=1200',
    'https://www.100percent.com/cdn/shop/files/2000x2000-eComm_20PDP-Casual_Region_20Tee_0001_Layer_2030.jpg?v=1764633177&width=1200',
    'https://www.100percent.com/cdn/shop/files/FA25_LS_OS_TEE_REGION__2020142-10002_F-002.jpg?v=1764633155&width=1100',
];

const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
        .format(price)
        .replace('Rp', 'Rp ');

const itemMeta = (item: CartItem) =>
    [item.color, item.size].filter(Boolean).join(' / ') ||
    'AxeGear Performance';

export default function MyCart({
    cartItems,
    summary,
    suggestedProducts,
}: PageProps) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const [processingItemId, setProcessingItemId] = useState<number | null>(
        null,
    );
    const [processingAction, setProcessingAction] = useState<
        'update' | 'remove' | null
    >(null);

    const isEmpty = cartItems.length === 0;
    const errorMessage =
        errors.quantity || errors.cart_item || errors.product_variant_id;
    const checkoutHref = useMemo(() => checkout.url(), []);
    const stockIssueItems = useMemo(
        () => cartItems.filter((item) => !item.is_available),
        [cartItems],
    );
    const hasStockIssues = stockIssueItems.length > 0;

    const stockIssueMessage = (item: CartItem) => {
        if (item.available_stock <= 0) {
            return 'Product is out of stock. Checkout is unavailable.';
        }

        if (item.available_stock < item.quantity) {
            return `Only ${item.available_stock} left in stock. Update quantity before checkout.`;
        }

        return 'Product is unavailable. Checkout is unavailable.';
    };

    const continueToCheckout = () => {
        if (hasStockIssues) {
            toast.error('Update unavailable cart items before checkout.');

            return;
        }

        router.visit(checkoutHref);
    };

    const updateQuantity = (item: CartItem, nextQuantity: number) => {
        if (
            processingItemId !== null ||
            nextQuantity < 1 ||
            nextQuantity === item.quantity ||
            nextQuantity > Math.max(1, item.available_stock)
        ) {
            return;
        }

        setProcessingItemId(item.id);
        setProcessingAction('update');

        router.patch(
            updateCartItemQuantity(item.id),
            { quantity: nextQuantity },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setProcessingItemId(null);
                    setProcessingAction(null);
                },
            },
        );
    };

    const removeItem = (item: CartItem) => {
        if (processingItemId !== null) {
            return;
        }

        setProcessingItemId(item.id);
        setProcessingAction('remove');

        router.delete(removeCartItem(item.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setProcessingItemId(null);
                setProcessingAction(null);
            },
        });
    };

    return (
        <ShopLayout>
            <Head title="My Cart - AxeGear" />

            <main className="bg-white px-4 py-5 text-[#1A1A1A] md:px-9 md:py-7">
                <div className="mx-auto max-w-[1760px]">
                    <div className="mb-8 flex items-center gap-2 text-sm font-medium">
                        <Link href="/" className="hover:text-[#F58220]">
                            Home
                        </Link>
                        <span className="text-[#707070]">/</span>
                        <span className="font-extrabold">My Cart</span>
                    </div>

                    {!isEmpty ? (
                        <>
                            <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] lg:items-end">
                                <div>
                                    <h1 className="text-[36px] leading-none font-black tracking-normal md:text-[46px]">
                                        My Cart
                                    </h1>
                                    <p className="mt-3 text-base font-medium text-[#2E2E2E]">
                                        Review your items before checkout.
                                    </p>
                                    <Link
                                        href={list.url()}
                                        className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold hover:text-[#F58220]"
                                    >
                                        <ChevronLeft
                                            size={18}
                                            className="text-[#F58220]"
                                        />
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            {(errorMessage || hasStockIssues) && (
                                <div className="mb-8 border border-[#F7B06A] bg-[#FFF3E8] px-4 py-3 text-sm font-bold text-[#1A1A1A]">
                                    {errorMessage ||
                                        'Some items are out of stock or unavailable. Update your cart before checkout.'}
                                </div>
                            )}

                            <div className="mb-12 grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] lg:items-start">
                                <section className="min-w-0">
                                    <div className="overflow-hidden border border-[#CFCFCF]">
                                        <div className="hidden grid-cols-[1fr_170px_190px_170px_50px] border-b border-[#CFCFCF] bg-white px-6 py-4 text-xs font-black tracking-[0.04em] uppercase lg:grid">
                                            <span>Product</span>
                                            <span>Price</span>
                                            <span>Quantity</span>
                                            <span>Subtotal</span>
                                            <span />
                                        </div>

                                        {cartItems.map((item, index) => {
                                            const isUpdating =
                                                processingItemId === item.id &&
                                                processingAction === 'update';
                                            const isRemoving =
                                                processingItemId === item.id &&
                                                processingAction === 'remove';
                                            const itemDisabled =
                                                isUpdating || isRemoving;
                                            const productHref =
                                                item.product_slug
                                                    ? detail.url({
                                                          query: {
                                                              product:
                                                                  item.product_slug,
                                                          },
                                                      })
                                                    : undefined;
                                            const canIncrease =
                                                item.is_available &&
                                                item.quantity <
                                                    Math.max(
                                                        1,
                                                        item.available_stock,
                                                    );
                                            const image =
                                                item.image ??
                                                fallbackImages[
                                                    index %
                                                        fallbackImages.length
                                                ];

                                            return (
                                                <article
                                                    key={item.id}
                                                    className="grid gap-4 border-b border-[#D8D8D8] bg-white p-4 last:border-b-0 lg:grid-cols-[1fr_170px_190px_170px_50px] lg:items-center lg:px-6 lg:py-3"
                                                >
                                                    <div className="grid grid-cols-[118px_1fr] items-center gap-4 md:grid-cols-[260px_1fr]">
                                                        {productHref ? (
                                                            <Link
                                                                href={
                                                                    productHref
                                                                }
                                                                className="block h-[110px] bg-[#F8F8F8] p-2 md:h-[118px]"
                                                            >
                                                                <img
                                                                    src={image}
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="h-full w-full object-contain"
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                />
                                                            </Link>
                                                        ) : (
                                                            <div className="h-[110px] bg-[#F8F8F8] p-2 md:h-[118px]">
                                                                <img
                                                                    src={image}
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="h-full w-full object-contain"
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            {productHref ? (
                                                                <Link
                                                                    href={
                                                                        productHref
                                                                    }
                                                                    className="text-base font-black tracking-normal uppercase hover:text-[#F58220]"
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                            ) : (
                                                                <h2 className="text-base font-black tracking-normal uppercase">
                                                                    {item.title}
                                                                </h2>
                                                            )}
                                                            <p className="mt-2 text-sm font-medium text-[#2E2E2E]">
                                                                {itemMeta(item)}
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-[#2E2E2E]">
                                                                {item.variant
                                                                    .sku ??
                                                                    'AxeGear'}
                                                            </p>
                                                            {!item.is_available && (
                                                                <p className="mt-2 text-xs font-extrabold text-[#C81E1E]">
                                                                    {stockIssueMessage(
                                                                        item,
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between lg:block">
                                                        <span className="text-xs font-black text-[#707070] uppercase lg:hidden">
                                                            Price
                                                        </span>
                                                        <span className="font-black tabular-nums">
                                                            {formatPrice(
                                                                item.price,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between lg:block">
                                                        <span className="text-xs font-black text-[#707070] uppercase lg:hidden">
                                                            Quantity
                                                        </span>
                                                        <QuantityControl
                                                            quantity={
                                                                item.quantity
                                                            }
                                                            disabled={
                                                                itemDisabled
                                                            }
                                                            canIncrease={
                                                                canIncrease
                                                            }
                                                            onDecrease={() =>
                                                                updateQuantity(
                                                                    item,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                            onIncrease={() =>
                                                                updateQuantity(
                                                                    item,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between lg:block">
                                                        <span className="text-xs font-black text-[#707070] uppercase lg:hidden">
                                                            Subtotal
                                                        </span>
                                                        <span className="font-black tabular-nums">
                                                            {formatPrice(
                                                                item.subtotal,
                                                            )}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(item)
                                                        }
                                                        disabled={itemDisabled}
                                                        className="flex h-10 w-10 items-center justify-center justify-self-end text-[#1A1A1A] transition-colors hover:text-[#F58220] disabled:opacity-40"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2
                                                            size={18}
                                                            strokeWidth={1.8}
                                                        />
                                                    </button>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </section>

                                <OrderSummary
                                    summary={summary}
                                    hasStockIssues={hasStockIssues}
                                    onCheckout={continueToCheckout}
                                />
                            </div>

                            {suggestedProducts.length > 0 && (
                                <SuggestedProducts
                                    products={suggestedProducts}
                                />
                            )}
                        </>
                    ) : (
                        <EmptyCart />
                    )}
                </div>
            </main>
        </ShopLayout>
    );
}

function QuantityControl({
    quantity,
    disabled,
    canIncrease,
    onDecrease,
    onIncrease,
}: {
    quantity: number;
    disabled: boolean;
    canIncrease: boolean;
    onDecrease: () => void;
    onIncrease: () => void;
}) {
    return (
        <div className="inline-grid h-10 grid-cols-3 border border-[#CFCFCF] bg-white text-sm font-black">
            <button
                type="button"
                onClick={onDecrease}
                disabled={disabled || quantity <= 1}
                className="flex w-10 items-center justify-center transition-colors hover:bg-[#F8F8F8] disabled:opacity-35"
                aria-label="Decrease quantity"
            >
                <Minus size={16} strokeWidth={2} />
            </button>
            <span className="flex w-10 items-center justify-center tabular-nums">
                {quantity}
            </span>
            <button
                type="button"
                onClick={onIncrease}
                disabled={disabled || !canIncrease}
                className="flex w-10 items-center justify-center text-[#F58220] transition-colors hover:bg-[#FFF3E8] disabled:opacity-35"
                aria-label="Increase quantity"
            >
                <Plus size={17} strokeWidth={2.4} />
            </button>
        </div>
    );
}


function OrderSummary({
    summary,
    hasStockIssues,
    onCheckout,
}: {
    summary: CartSummary;
    hasStockIssues: boolean;
    onCheckout: () => void;
}) {
    return (
        <aside className="min-w-0 border border-[#CFCFCF] bg-white p-6 lg:p-7">
            <h2 className="mb-5 text-2xl font-black tracking-normal uppercase">
                Order Summary
            </h2>
            <div className="space-y-4 text-base font-medium">
                <SummaryRow
                    label={`Subtotal (${summary.item_count} items)`}
                    value={formatPrice(summary.subtotal)}
                />
                <SummaryRow
                    label="Estimated Shipping"
                    value={formatPrice(summary.shipping)}
                    icon={<Info size={17} strokeWidth={1.8} />}
                />
                <SummaryRow
                    label="Discount"
                    value={`-${formatPrice(summary.discount)}`}
                    accent
                />
            </div>
            <div className="my-6 border-t border-[#CFCFCF]" />
            <div className="mb-3 flex items-end justify-between gap-4">
                <span className="text-2xl font-black uppercase">Total</span>
                <span className="text-[30px] leading-none font-black text-[#F58220] tabular-nums">
                    {formatPrice(summary.total)}
                </span>
            </div>
            <p className="mb-7 text-sm font-medium text-[#2E2E2E]">
                Taxes and shipping calculated at checkout.
            </p>
            <button
                type="button"
                onClick={onCheckout}
                disabled={hasStockIssues}
                className="h-12 w-full bg-[#F58220] text-sm font-black tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#E67312] disabled:bg-[#CFCFCF] disabled:text-[#707070]"
            >
                Proceed to Checkout
            </button>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-medium">
                <TrustItem icon={ShieldCheck} label="Secure Checkout" />
                <TrustItem icon={RotateCcw} label="30-Day Returns" />
                <TrustItem icon={BadgeCheck} label="1-Year Warranty" />
            </div>
        </aside>
    );
}

function SummaryRow({
    label,
    value,
    accent = false,
    icon,
}: {
    label: string;
    value: string;
    accent?: boolean;
    icon?: React.ReactNode;
}) {
    return (
        <div
            className={`flex items-start justify-between gap-4 ${accent ? 'font-black text-[#F58220]' : ''}`}
        >
            <span className="flex min-w-0 items-center gap-2">
                {label}
                {icon}
            </span>
            <span className="shrink-0 font-black tabular-nums">{value}</span>
        </div>
    );
}

function TrustItem({
    icon: Icon,
    label,
}: {
    icon: typeof ShieldCheck;
    label: string;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            <Icon className="h-8 w-8" strokeWidth={1.7} />
            <span>{label}</span>
        </div>
    );
}

function SuggestedProducts({ products }: { products: SuggestedProduct[] }) {
    return (
        <section className="mt-8 pb-3">
            <h2 className="mb-2 text-2xl font-black tracking-normal uppercase">
                You May Also Like
            </h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {products.slice(0, 4).map((product, index) => (
                    <Link
                        key={product.id}
                        href={detail.url({ query: { product: product.slug } })}
                        className="grid min-h-[132px] grid-cols-[180px_1fr] border border-[#E5E5E5] bg-white p-4 transition-colors hover:border-[#1A1A1A]"
                    >
                        <div className="bg-[#F8F8F8] p-2">
                            <img
                                src={
                                    product.image ??
                                    fallbackImages[
                                        index % fallbackImages.length
                                    ]
                                }
                                alt={product.title}
                                className="h-full w-full object-contain"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className="flex flex-col pl-4">
                            <h3 className="text-base leading-tight font-black uppercase">
                                {product.title}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-[#2E2E2E]">
                                AxeGear Performance
                            </p>
                            <p className="mt-1 text-sm font-black">
                                {formatPrice(product.price)}
                            </p>
                            <span className="mt-auto flex h-8 items-center justify-center border border-[#F58220] text-xs font-black tracking-[0.05em] text-[#F58220] uppercase hover:bg-[#F58220] hover:text-white">
                                {index === 2 ? 'View Product' : 'Quick Add'}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function EmptyCart() {
    return (
        <section className="flex min-h-[520px] flex-col items-center justify-center border border-[#CFCFCF] bg-white px-6 py-20 text-center">
            <h1 className="text-[40px] leading-none font-black uppercase md:text-[56px]">
                Your cart is empty
            </h1>
            <p className="mt-4 max-w-md text-base font-medium text-[#707070]">
                Add performance eyewear, goggles, and race-day essentials before
                checkout.
            </p>
            <Link
                href={list.url()}
                className="mt-8 inline-flex h-12 items-center justify-center bg-[#F58220] px-8 text-sm font-black tracking-[0.06em] text-white uppercase hover:bg-[#E67312]"
            >
                Continue Shopping
            </Link>
        </section>
    );
}
