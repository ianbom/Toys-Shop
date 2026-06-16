import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    ChevronUp,
    Heart,
    Home,
    Minus,
    Plus,
    Star,
    Store,
    Truck,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, FormEvent, ReactNode } from 'react';
import { toast } from 'sonner';

import { addProductVariantToCart as addProductVariantToCartRoute } from '@/actions/App/Http/Controllers/Customer/CartController';
import {
    destroyProduct as removeWishlistProduct,
    store as addWishlistItem,
} from '@/actions/App/Http/Controllers/Customer/WishlistController';
import HTMLRender from '@/components/HTMLRender';
import ShopLayout from '@/layouts/shop-layout';
import { cart, detail, list } from '@/routes';

type Variant = {
    id: number;
    sku: string | null;
    color_name: string | null;
    color_hex: string | null;
    size: string | null;
    additional_price?: number | null;
    regular_price?: number | null;
    sale_price?: number | null;
    package_type?: string | null;
    stock: number;
    reserved_stock: number;
    available_stock: number;
    cart_quantity: number;
    image_url: string | null;
};

type ProductCard = {
    id: number;
    slug: string;
    title: string;
    sku: string | null;
    price: number;
    sale_price: number | null;
    image: string | null;
    badge: string | null;
    category: string | null;
    category_slug: string | null;
    collection: string | null;
    collection_slug: string | null;
    colors: Array<{
        name: string | null;
        hex: string;
    }>;
    sizes: string[];
    available_stock: number;
};

type ProductDetail = ProductCard & {
    short_description: string | null;
    description: string | null;
    material: string | null;
    care_instruction: string | null;
    weight: number | null;
    dimensions: {
        length: number | null;
        width: number | null;
        height: number | null;
    };
    images: Array<{
        url: string;
        alt: string;
    }>;
    variants: Variant[];
    is_wishlisted: boolean;
};

type Props = {
    product: ProductDetail;
    relatedProducts: ProductCard[];
    recentProducts: ProductCard[];
};

type IconType = ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
}>;

const fallbackImages = [
    '/img/abdul-raheem-kannath-aNWfK46QWto-unsplash.webp',
    '/img/ainur-iman-qcNmigFPTQM-unsplash.webp',
    '/img/atiyeh-fathi-CvdzGjVX9DA-unsplash.webp',
    '/img/hasan-almasi-_X2UAmIcpko-unsplash.webp',
    '/img/ike-ellyana-2F70bGqQVa4-unsplash.webp',
];

const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(Math.max(1, value / 16000));

const uniqueValues = (values: Array<string | null>) =>
    Array.from(new Set(values.filter(Boolean))) as string[];

const ratingForProduct = (id: number) => {
    const value = 4.6 + ((id % 4) * 0.1 + (id % 3) * 0.03);
    const rounded = Math.min(5, Math.round(value * 10) / 10);
    const reviews = 180 + (id % 290);

    return {
        score: rounded.toFixed(1),
        reviews,
    };
};

const badgeLabel = (badge: string | null, seed: number) => {
    if (badge) {
        if (badge === 'DISCOUNT') {
            return 'Sale';
        }

        return badge
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/(^|\s)\S/g, (value) => value.toUpperCase());
    }

    return seed % 2 === 0 ? 'New' : 'Best Seller';
};

const formatDimension = (value: number | null) =>
    value === null ? null : `${value} cm`;

export default function DetailProduct({
    product,
    relatedProducts,
    recentProducts,
}: Props) {
    return (
        <DetailProductContent
            key={product.id}
            product={product}
            relatedProducts={relatedProducts}
            recentProducts={recentProducts}
        />
    );
}

function DetailProductContent({
    product,
    relatedProducts,
    recentProducts,
}: Props) {
    const variants = useMemo(
        () =>
            [...product.variants].sort((left, right) => {
                const leftAvailable = left.available_stock > 0 ? 1 : 0;
                const rightAvailable = right.available_stock > 0 ? 1 : 0;

                if (leftAvailable !== rightAvailable) {
                    return rightAvailable - leftAvailable;
                }

                return left.id - right.id;
            }),
        [product.variants],
    );
    const gallery = useMemo(() => {
        if (product.images.length > 0) {
            return product.images;
        }

        return [
            {
                url: product.image ?? fallbackImages[0],
                alt: product.title,
            },
        ];
    }, [product]);
    const colorVariants = useMemo(
        () =>
            variants
                .filter((variant) => variant.color_name || variant.color_hex)
                .filter(
                    (variant, index, variantList) =>
                        variantList.findIndex(
                            (candidate) =>
                                candidate.color_name === variant.color_name &&
                                candidate.color_hex === variant.color_hex,
                        ) === index,
                ),
        [variants],
    );
    const initialVariant = useMemo(
        () =>
            variants.find((variant) => variant.available_stock > 0) ??
            variants[0],
        [variants],
    );
    const [mainImage, setMainImage] = useState(
        gallery[0]?.url ?? fallbackImages[0],
    );
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
        initialVariant?.id ?? null,
    );
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);
    const [isWishlistProcessing, setIsWishlistProcessing] = useState(false);
    const cartForm = useForm<{
        quantity: number;
        product_variant_id?: number;
    }>({ quantity: 1 });

    const selectedVariant = useMemo(
        () =>
            variants.find((variant) => variant.id === selectedVariantId) ??
            initialVariant,
        [initialVariant, selectedVariantId, variants],
    );
    const selectedColor = selectedVariant?.color_name ?? '';
    const selectedSize = selectedVariant?.size ?? '';
    const sizes = useMemo(
        () =>
            uniqueValues(
                variants
                    .filter(
                        (variant) =>
                            selectedColor === '' ||
                            variant.color_name === selectedColor,
                    )
                    .map((variant) => variant.size),
            ),
        [selectedColor, variants],
    );

    const variantPrice =
        selectedVariant?.sale_price ??
        selectedVariant?.regular_price ??
        (product.sale_price ?? product.price) +
            (selectedVariant?.additional_price ?? 0);
    const basePrice =
        selectedVariant?.regular_price ??
        product.price + (selectedVariant?.additional_price ?? 0);
    const selectedAvailableStock =
        selectedVariant?.available_stock ?? product.available_stock;
    const selectedCartQuantity = selectedVariant?.cart_quantity ?? 0;
    const remainingStock = Math.max(
        0,
        selectedAvailableStock - selectedCartQuantity,
    );
    const maxQuantity = Math.max(1, selectedAvailableStock);
    const effectiveQuantity = Math.min(quantity, maxQuantity);
    const cartStockExceeded =
        selectedVariant !== undefined &&
        selectedCartQuantity + effectiveQuantity > selectedAvailableStock;
    const isAvailable =
        product.available_stock > 0 && selectedAvailableStock > 0;
    const productDescription = product.description || product.short_description;
    const railProducts =
        relatedProducts.length > 0 ? relatedProducts : recentProducts;
    const rating = ratingForProduct(product.id);
    const displayBadge = badgeLabel(product.badge, product.id);
    const detailFacts = [
        product.material ? `Made with ${product.material}` : null,
        selectedVariant?.package_type
            ? `${selectedVariant.package_type} package ready for gifting`
            : null,
        product.weight !== null
            ? `Lightweight ${product.weight} gram build`
            : null,
        selectedVariant?.sku ? `SKU ${selectedVariant.sku}` : null,
    ].filter(Boolean) as string[];
    const dimensionFacts = [
        formatDimension(product.dimensions.length),
        formatDimension(product.dimensions.width),
        formatDimension(product.dimensions.height),
    ].filter((value): value is string => Boolean(value));

    const decreaseQuantity = () => {
        const nextQuantity = Math.max(1, effectiveQuantity - 1);

        setQuantity(nextQuantity);
        cartForm.setData('quantity', nextQuantity);
    };

    const increaseQuantity = () => {
        const nextQuantity = Math.min(maxQuantity, effectiveQuantity + 1);

        setQuantity(nextQuantity);
        cartForm.setData('quantity', nextQuantity);
    };

    const selectVariant = (variantId: number | null) => {
        setSelectedVariantId(variantId);
        setQuantity(1);
        cartForm.setData('quantity', 1);

        const nextVariant = variants.find(
            (variant) => variant.id === variantId,
        );

        if (nextVariant?.image_url) {
            setMainImage(nextVariant.image_url);
        }
    };

    const addProductVariantToCart = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedVariant || !isAvailable || cartForm.processing) {
            return;
        }

        if (cartStockExceeded) {
            toast.error('Cart quantity exceeds available stock.');

            return;
        }

        cartForm.setData('quantity', effectiveQuantity);
        cartForm.submit(addProductVariantToCartRoute(selectedVariant.id), {
            preserveScroll: true,
        });
    };

    const buyItNow = () => {
        if (!selectedVariant || !isAvailable || cartForm.processing) {
            return;
        }

        if (selectedCartQuantity > 0) {
            router.visit(cart.url());

            return;
        }

        if (cartStockExceeded) {
            toast.error('Cart quantity exceeds available stock.');

            return;
        }

        cartForm.setData('quantity', effectiveQuantity);
        cartForm.submit(addProductVariantToCartRoute(selectedVariant.id), {
            preserveScroll: true,
            onSuccess: () => router.visit(cart.url()),
        });
    };

    const toggleWishlist = () => {
        if (isWishlistProcessing) {
            return;
        }

        setIsWishlistProcessing(true);

        const options = {
            preserveScroll: true,
            onSuccess: () => setIsWishlisted((current) => !current),
            onFinish: () => setIsWishlistProcessing(false),
        };

        if (isWishlisted) {
            router.delete(removeWishlistProduct.url(product.id), options);

            return;
        }

        router.post(addWishlistItem.url(product.id), {}, options);
    };

    return (
        <ShopLayout>
            <Head title={`${product.title} - Little Toy Toys`} />

            <main className="relative overflow-hidden bg-white pb-18 text-[#061B5B] lg:pb-24">
                <div className="toy-doodle-star absolute top-16 left-3 hidden h-10 w-10 lg:block" />
                <div className="toy-doodle-loop absolute top-72 left-0 hidden h-10 w-10 lg:block" />
                <div className="toy-doodle-swirl absolute top-28 right-4 hidden h-10 w-10 lg:block" />

                <section className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
                    <Breadcrumb product={product} />

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start lg:gap-8 xl:gap-10">
                        <FadeInOnScroll>
                            <ProductGallery
                                gallery={gallery}
                                mainImage={mainImage}
                                productTitle={product.title}
                                badge={displayBadge}
                                onSelectImage={setMainImage}
                            />
                        </FadeInOnScroll>

                        <FadeInOnScroll delay={80}>
                            <section className="toy-card relative overflow-hidden p-6 sm:p-7 lg:p-8">
                                <div className="pointer-events-none absolute -top-8 right-8 h-28 w-28 rounded-full bg-[#A9D8F6]/30 blur-2xl" />

                                <ProductHeader
                                    product={product}
                                    price={variantPrice}
                                    basePrice={basePrice}
                                    badge={displayBadge}
                                    rating={rating}
                                    isWishlisted={isWishlisted}
                                    isWishlistProcessing={isWishlistProcessing}
                                    onToggleWishlist={toggleWishlist}
                                />

                                <div className="mt-6 space-y-6">
                                    <div>
                                        <p className="max-w-[62ch] text-base leading-7 font-semibold text-[#26345E]">
                                            {product.short_description ||
                                                'A bright, parent-friendly favorite built for imaginative play, gifting, and everyday smiles.'}
                                        </p>
                                        {detailFacts.length > 0 && (
                                            <ul className="mt-5 space-y-3 text-sm font-bold text-[#26345E]">
                                                {detailFacts
                                                    .slice(0, 4)
                                                    .map((item) => (
                                                        <li
                                                            key={item}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF8A00]" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </div>

                                    {colorVariants.length > 0 && (
                                        <StylePicker
                                            variants={variants}
                                            colorVariants={colorVariants}
                                            selectedColor={selectedColor}
                                            productImage={product.image}
                                            galleryImage={gallery[0]?.url}
                                            onSelectVariant={selectVariant}
                                        />
                                    )}

                                    {sizes.length > 0 && (
                                        <SizePicker
                                            sizes={sizes}
                                            variants={variants}
                                            selectedColor={selectedColor}
                                            selectedSize={selectedSize}
                                            onSelectVariant={selectVariant}
                                            onOpenSizeGuide={() =>
                                                setIsSizeGuideOpen(true)
                                            }
                                        />
                                    )}

                                    <form
                                        onSubmit={addProductVariantToCart}
                                        className="space-y-4 rounded-[24px] border border-hairline bg-[#FAFAFA] p-4 sm:p-5"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                            <div>
                                                <p className="text-sm font-black tracking-[0.04em] text-[#061B5B] uppercase">
                                                    Quantity
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-[#6F7691]">
                                                    {isAvailable
                                                        ? `${selectedAvailableStock} ready to ship`
                                                        : 'Currently unavailable'}
                                                </p>
                                            </div>
                                            <QuantityControl
                                                quantity={effectiveQuantity}
                                                onDecrease={decreaseQuantity}
                                                onIncrease={increaseQuantity}
                                                disableDecrease={quantity <= 1}
                                                disableIncrease={
                                                    effectiveQuantity >=
                                                        maxQuantity ||
                                                    !isAvailable
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <button
                                                type="submit"
                                                disabled={
                                                    !isAvailable ||
                                                    !selectedVariant ||
                                                    cartForm.processing
                                                }
                                                className="toy-btn-primary w-full"
                                            >
                                                {cartForm.processing
                                                    ? 'Adding...'
                                                    : isAvailable
                                                      ? 'Add to Cart'
                                                      : 'Sold Out'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={buyItNow}
                                                disabled={
                                                    !isAvailable ||
                                                    !selectedVariant ||
                                                    cartForm.processing
                                                }
                                                className="toy-btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Buy It Now
                                            </button>
                                        </div>

                                        {cartForm.errors.product_variant_id && (
                                            <StatusNote tone="error">
                                                {
                                                    cartForm.errors
                                                        .product_variant_id
                                                }
                                            </StatusNote>
                                        )}

                                        {selectedCartQuantity > 0 && (
                                            <StatusNote
                                                tone={
                                                    cartStockExceeded
                                                        ? 'error'
                                                        : 'info'
                                                }
                                            >
                                                {cartStockExceeded
                                                    ? 'Cart quantity exceeds available stock.'
                                                    : `In cart: ${selectedCartQuantity}. Remaining stock: ${remainingStock}.`}
                                            </StatusNote>
                                        )}
                                    </form>

                                    <ServiceStrip isAvailable={isAvailable} />
                                </div>
                            </section>
                        </FadeInOnScroll>
                    </div>

                    <FadeInOnScroll delay={120}>
                        <ProductAccordions
                            product={product}
                            selectedVariant={selectedVariant}
                            productDescription={productDescription}
                            dimensions={dimensionFacts}
                        />
                    </FadeInOnScroll>

                    <OtherStyles products={railProducts} />
                </section>

                <FloatingActions />
            </main>

            {isSizeGuideOpen && (
                <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} />
            )}
        </ShopLayout>
    );
}

function Breadcrumb({ product }: { product: ProductDetail }) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold text-[#061B5B]"
        >
            <Link
                href="/"
                className="inline-flex items-center gap-2 hover:text-[#1F7AE5]"
            >
                <Home size={14} strokeWidth={2.3} />
                <span>Home</span>
            </Link>
            <span className="text-[#6F7691]">›</span>
            <Link href={list.url()} className="hover:text-[#1F7AE5]">
                Shop By Age
            </Link>
            {product.category && (
                <>
                    <span className="text-[#6F7691]">›</span>
                    <Link
                        href={list.url({
                            query: { category: product.category_slug },
                        })}
                        className="hover:text-[#1F7AE5]"
                    >
                        {product.category}
                    </Link>
                </>
            )}
            <span className="text-[#6F7691]">›</span>
            <span className="text-[#26345E]">{product.title}</span>
        </nav>
    );
}

function ProductGallery({
    gallery,
    mainImage,
    productTitle,
    badge,
    onSelectImage,
}: {
    gallery: Array<{ url: string; alt: string }>;
    mainImage: string;
    productTitle: string;
    badge: string;
    onSelectImage: (image: string) => void;
}) {
    const galleryItems = gallery.slice(0, 6);

    return (
        <section className="toy-card overflow-hidden p-4 sm:p-5 lg:p-6">
            <div className="grid gap-4 md:grid-cols-[92px_minmax(0,1fr)] lg:grid-cols-[104px_minmax(0,1fr)]">
                <div className="order-2 flex gap-3 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-visible md:pb-0">
                    {galleryItems.map((image, index) => {
                        const isActive = mainImage === image.url;

                        return (
                            <button
                                key={`${image.url}-${index}`}
                                type="button"
                                onClick={() => onSelectImage(image.url)}
                                className={`shrink-0 overflow-hidden rounded-[18px] border bg-white p-2 transition-all ${
                                    isActive
                                        ? 'border-[#061B5B] shadow-subtle'
                                        : 'border-hairline hover:border-[#1F7AE5]'
                                }`}
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-[14px] bg-[#FAFAFA] sm:h-24 sm:w-24 md:h-[84px] md:w-[84px] lg:h-[92px] lg:w-[92px]">
                                    <img
                                        src={image.url}
                                        alt={image.alt || productTitle}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="relative order-1 rounded-[30px] bg-[#FAFAFA] p-6 sm:p-8 md:order-2 lg:min-h-[660px] lg:p-10">
                    <span className="toy-handwritten absolute top-5 right-6 text-[1.8rem] text-[#061B5B] sm:text-[2rem]">
                        {badge}
                    </span>
                    <div className="pointer-events-none absolute top-10 left-8 h-24 w-24 rounded-full bg-[#A9D8F6]/45 blur-2xl" />
                    <div className="pointer-events-none absolute right-10 bottom-10 h-28 w-28 rounded-full bg-[#FFC94A]/25 blur-3xl" />
                    <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[420px] lg:min-h-[560px]">
                        <img
                            src={mainImage}
                            alt={productTitle}
                            className="max-h-[560px] w-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProductHeader({
    product,
    price,
    basePrice,
    badge,
    rating,
    isWishlisted,
    isWishlistProcessing,
    onToggleWishlist,
}: {
    product: ProductDetail;
    price: number;
    basePrice: number;
    badge: string;
    rating: { score: string; reviews: number };
    isWishlisted: boolean;
    isWishlistProcessing: boolean;
    onToggleWishlist: () => void;
}) {
    const hasSale = price < basePrice;

    return (
        <header>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="toy-handwritten text-[1.55rem] text-[#EF2B2D]">
                        {badge}
                    </p>
                    <h1 className="mt-2 max-w-[16ch] text-[2.35rem] leading-[1.02] font-black text-[#061B5B] sm:text-[2.85rem]">
                        {product.title}
                    </h1>
                </div>

                <button
                    type="button"
                    aria-label={
                        isWishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                    onClick={onToggleWishlist}
                    disabled={isWishlistProcessing}
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white transition ${
                        isWishlisted
                            ? 'border-[#EF2B2D] text-[#EF2B2D]'
                            : 'border-hairline-strong text-[#061B5B] hover:border-[#061B5B]'
                    }`}
                >
                    <Heart
                        size={20}
                        strokeWidth={2.2}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                    />
                </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-[#061B5B]">
                <span className="flex items-center gap-0.5 text-[#FF8A00]">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={index}
                            size={17}
                            fill="currentColor"
                            strokeWidth={0}
                        />
                    ))}
                </span>
                <span>{rating.score}</span>
                <span>({rating.reviews} reviews)</span>
                <span className="rounded-full bg-[#EEF7FF] px-3 py-1 text-[#1F7AE5]">
                    {product.collection || product.category || 'Toy favorite'}
                </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="text-[2.35rem] leading-none font-black text-[#061B5B] tabular-nums">
                    {formatPrice(price)}
                </span>
                {hasSale && (
                    <span className="pb-1 text-lg font-bold text-[#6F7691] tabular-nums line-through">
                        {formatPrice(basePrice)}
                    </span>
                )}
            </div>

            <p className="mt-3 text-sm font-semibold text-[#26345E]">
                Loved for gifting, easy to wrap, and ready for bright playroom
                shelves.
            </p>
        </header>
    );
}

function StylePicker({
    variants,
    colorVariants,
    selectedColor,
    productImage,
    galleryImage,
    onSelectVariant,
}: {
    variants: Variant[];
    colorVariants: Variant[];
    selectedColor: string;
    productImage: string | null;
    galleryImage: string | undefined;
    onSelectVariant: (variantId: number | null) => void;
}) {
    return (
        <section>
            <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-black tracking-[0.04em] text-[#061B5B] uppercase">
                        Style
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#6F7691]">
                        Pick the look your little one will spot first.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {colorVariants.slice(0, 8).map((variant) => {
                    const colorAvailable = variants.some(
                        (candidate) =>
                            candidate.color_name ===
                                (variant.color_name ?? '') &&
                            candidate.available_stock > 0,
                    );
                    const isSelected =
                        selectedColor === (variant.color_name ?? '');
                    const variantImage =
                        variant.image_url ??
                        productImage ??
                        galleryImage ??
                        fallbackImages[0];

                    return (
                        <button
                            key={`${variant.color_name}-${variant.color_hex}`}
                            type="button"
                            disabled={!colorAvailable}
                            onClick={() => {
                                const nextVariant = variants.find(
                                    (candidate) =>
                                        candidate.color_name ===
                                            variant.color_name &&
                                        candidate.available_stock > 0,
                                );

                                onSelectVariant(nextVariant?.id ?? variant.id);
                            }}
                            className={`rounded-[22px] border bg-white p-3 text-left transition ${
                                isSelected
                                    ? 'border-[#061B5B] shadow-subtle'
                                    : 'border-hairline hover:border-[#1F7AE5]'
                            } ${!colorAvailable ? 'cursor-not-allowed opacity-45' : ''}`}
                        >
                            <div className="flex aspect-[1.18] items-center justify-center rounded-[18px] bg-[#FAFAFA] p-3">
                                <img
                                    src={variantImage}
                                    alt={variant.color_name ?? 'Product style'}
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <span
                                    className="h-4 w-4 rounded-full border border-[#CBD2E4]"
                                    style={{
                                        backgroundColor:
                                            variant.color_hex ?? '#A9D8F6',
                                    }}
                                />
                                <span className="truncate text-sm font-black text-[#061B5B]">
                                    {variant.color_name ||
                                        variant.color_hex ||
                                        'Style'}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function SizePicker({
    sizes,
    variants,
    selectedColor,
    selectedSize,
    onSelectVariant,
    onOpenSizeGuide,
}: {
    sizes: string[];
    variants: Variant[];
    selectedColor: string;
    selectedSize: string;
    onSelectVariant: (variantId: number | null) => void;
    onOpenSizeGuide: () => void;
}) {
    return (
        <section>
            <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-black tracking-[0.04em] text-[#061B5B] uppercase">
                        Size
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#6F7691]">
                        Choose the best fit before checkout.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-sm font-black text-[#1F7AE5] hover:underline"
                >
                    Size Guide
                </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => {
                    const sizeVariant =
                        variants.find(
                            (variant) =>
                                variant.size === size &&
                                variant.color_name === selectedColor,
                        ) ?? variants.find((variant) => variant.size === size);
                    const sizeAvailable =
                        (sizeVariant?.available_stock ?? 0) > 0;

                    return (
                        <button
                            key={size}
                            type="button"
                            disabled={!sizeAvailable}
                            onClick={() => {
                                if (!sizeAvailable) {
                                    return;
                                }

                                onSelectVariant(sizeVariant?.id ?? null);
                            }}
                            className={`min-h-11 min-w-[60px] rounded-full border px-4 text-sm font-black transition ${
                                !sizeAvailable
                                    ? 'cursor-not-allowed border-hairline bg-white text-[#9AA1BB] line-through'
                                    : selectedSize === size
                                      ? 'border-[#061B5B] bg-[#061B5B] text-white'
                                      : 'border-hairline-strong bg-white text-[#061B5B] hover:border-[#1F7AE5] hover:text-[#1F7AE5]'
                            }`}
                        >
                            {size}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function QuantityControl({
    quantity,
    onDecrease,
    onIncrease,
    disableDecrease,
    disableIncrease,
}: {
    quantity: number;
    onDecrease: () => void;
    onIncrease: () => void;
    disableDecrease: boolean;
    disableIncrease: boolean;
}) {
    return (
        <div className="inline-grid h-12 w-[156px] grid-cols-3 overflow-hidden rounded-full border border-hairline-strong bg-white text-base font-black text-[#061B5B]">
            <button
                type="button"
                onClick={onDecrease}
                disabled={disableDecrease}
                className="flex items-center justify-center transition hover:bg-[#EEF7FF] disabled:opacity-35"
                aria-label="Decrease quantity"
            >
                <Minus size={18} strokeWidth={2.2} />
            </button>
            <span className="flex items-center justify-center border-x border-hairline tabular-nums">
                {quantity}
            </span>
            <button
                type="button"
                onClick={onIncrease}
                disabled={disableIncrease}
                className="flex items-center justify-center transition hover:bg-[#EEF7FF] disabled:opacity-35"
                aria-label="Increase quantity"
            >
                <Plus size={18} strokeWidth={2.2} />
            </button>
        </div>
    );
}

function StatusNote({
    children,
    tone,
}: {
    children: ReactNode;
    tone: 'info' | 'error';
}) {
    return (
        <p
            className={`rounded-[18px] px-4 py-3 text-sm font-bold ${
                tone === 'error'
                    ? 'bg-[#FFF1F1] text-[#D83A3A]'
                    : 'bg-[#EEF7FF] text-[#1F7AE5]'
            }`}
        >
            {children}
        </p>
    );
}

function ServiceStrip({ isAvailable }: { isAvailable: boolean }) {
    const items: Array<{ title: string; body: string; icon: IconType }> = [
        {
            title: isAvailable ? 'Ready to ship' : 'Sold out for now',
            body: isAvailable
                ? 'Packed fast with cheerful gifting energy.'
                : 'Pick another style or check back soon.',
            icon: Truck,
        },
        {
            title: 'Store support',
            body: 'Need help picking a variant? We can guide you.',
            icon: Store,
        },
        {
            title: 'Restock alerts',
            body: 'Save your favorite and watch for inventory updates.',
            icon: Bell,
        },
    ];

    return (
        <section className="grid gap-3 sm:grid-cols-3">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="rounded-[22px] border border-hairline bg-white p-4"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF7FF] text-[#061B5B]">
                            <Icon size={20} strokeWidth={2} />
                        </div>
                        <p className="mt-3 text-base font-black text-[#061B5B]">
                            {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 font-semibold text-[#26345E]">
                            {item.body}
                        </p>
                    </div>
                );
            })}
        </section>
    );
}

function ProductAccordions({
    product,
    selectedVariant,
    productDescription,
    dimensions,
}: {
    product: ProductDetail;
    selectedVariant: Variant | undefined;
    productDescription: string | null;
    dimensions: string[];
}) {
    const defaultOpen = [0, 1];

    return (
        <section id="product-help" className="mt-10 lg:mt-12">
            <div className="mb-6 text-center">
                <p className="toy-handwritten text-[1.55rem] text-[#EF2B2D]">
                    More to know
                </p>
                <h2 className="mt-2 text-[2.2rem] leading-[1.05] font-black text-[#061B5B] sm:text-[2.7rem]">
                    Details, care, and shipping help
                </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <AccordionGroup
                    items={[
                        {
                            title: 'Product details',
                            content: (
                                <div className="space-y-4 text-sm leading-7 font-semibold text-[#26345E]">
                                    <HTMLRender
                                        html={productDescription}
                                        className="[&_a]:text-[#1F7AE5] [&_h1]:text-lg [&_h1]:font-black [&_h2]:text-base [&_h2]:font-black [&_strong]:font-black [&_strong]:text-[#061B5B] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
                                        emptyFallback={
                                            <p>
                                                {product.title} brings playful
                                                color, easy gifting, and
                                                everyday discovery to shelves,
                                                nurseries, and family rooms.
                                            </p>
                                        }
                                    />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {selectedVariant?.sku && (
                                            <FactTile
                                                label="SKU"
                                                value={selectedVariant.sku}
                                            />
                                        )}
                                        {selectedVariant?.package_type && (
                                            <FactTile
                                                label="Package"
                                                value={
                                                    selectedVariant.package_type
                                                }
                                            />
                                        )}
                                        {product.weight !== null && (
                                            <FactTile
                                                label="Weight"
                                                value={`${product.weight} gram`}
                                            />
                                        )}
                                        {dimensions.length > 0 && (
                                            <FactTile
                                                label="Dimensions"
                                                value={dimensions.join(' × ')}
                                            />
                                        )}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            title: 'Materials and care',
                            content: (
                                <div className="space-y-4 text-sm leading-7 font-semibold text-[#26345E]">
                                    <p>
                                        {product.material
                                            ? `Crafted with ${product.material}.`
                                            : 'Thoughtfully finished with kid-friendly materials and a display-ready look.'}
                                    </p>
                                    <p>
                                        {product.care_instruction ||
                                            'Wipe gently with a soft dry cloth and keep in a cool, clean spot between play sessions.'}
                                    </p>
                                </div>
                            ),
                        },
                    ]}
                    defaultOpen={defaultOpen}
                />

                <AccordionGroup
                    items={[
                        {
                            title: 'Shipping and returns',
                            content: (
                                <div className="space-y-3 text-sm leading-7 font-semibold text-[#26345E]">
                                    <p>
                                        Orders usually leave the shop quickly,
                                        with tracking shared as soon as your toy
                                        is packed.
                                    </p>
                                    <p>
                                        Need to swap a variant? Reach out before
                                        the order ships and we will help if
                                        stock allows.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            title: 'Need help choosing?',
                            content: (
                                <div className="space-y-3 text-sm leading-7 font-semibold text-[#26345E]">
                                    <p>
                                        Compare styles, check the size guide,
                                        and save your favorite before adding to
                                        cart.
                                    </p>
                                    <p>
                                        If the variant you want is unavailable,
                                        add it to your wishlist and watch for
                                        restocks.
                                    </p>
                                </div>
                            ),
                        },
                    ]}
                    defaultOpen={[0]}
                />
            </div>
        </section>
    );
}

function AccordionGroup({
    items,
    defaultOpen,
}: {
    items: Array<{ title: string; content: ReactNode }>;
    defaultOpen: number[];
}) {
    const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpen);

    const toggle = (index: number) => {
        setOpenIndexes((current) =>
            current.includes(index)
                ? current.filter((value) => value !== index)
                : [...current, index],
        );
    };

    return (
        <div className="overflow-hidden rounded-[28px] border border-hairline bg-white shadow-subtle">
            {items.map((item, index) => {
                const isOpen = openIndexes.includes(index);

                return (
                    <div
                        key={item.title}
                        className={
                            index === 0 ? '' : 'border-t border-hairline'
                        }
                    >
                        <button
                            type="button"
                            onClick={() => toggle(index)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                        >
                            <span className="text-lg font-black text-[#061B5B]">
                                {item.title}
                            </span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong text-[#061B5B]">
                                {isOpen ? (
                                    <ChevronUp size={18} strokeWidth={2.4} />
                                ) : (
                                    <ChevronDown size={18} strokeWidth={2.4} />
                                )}
                            </span>
                        </button>
                        {isOpen && (
                            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                                {item.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function FactTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[18px] bg-[#FAFAFA] px-4 py-3">
            <p className="text-xs font-black tracking-[0.04em] text-[#6F7691] uppercase">
                {label}
            </p>
            <p className="mt-1 text-sm font-bold text-[#061B5B]">{value}</p>
        </div>
    );
}

function OtherStyles({ products }: { products: ProductCard[] }) {
    if (products.length === 0) {
        return null;
    }

    return (
        <FadeInOnScroll className="mt-12 lg:mt-16">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="toy-handwritten text-[1.55rem] text-[#EF2B2D]">
                        Keep exploring
                    </p>
                    <h2 className="mt-2 text-[2.15rem] leading-[1.05] font-black text-[#061B5B] sm:text-[2.65rem]">
                        More playful picks
                    </h2>
                </div>
                <Link href={list.url()} className="toy-btn-secondary">
                    View All Toys
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {products.slice(0, 8).map((item, index) => {
                    const rating = ratingForProduct(item.id);
                    const productHref = detail.url({
                        query: { product: item.slug },
                    });

                    return (
                        <article
                            key={item.id}
                            className="toy-card group overflow-hidden p-4 pb-5 sm:p-5"
                        >
                            <Link href={productHref} className="block">
                                <div className="relative aspect-[0.95] overflow-hidden rounded-[18px] bg-white p-5">
                                    <img
                                        src={
                                            item.image ??
                                            fallbackImages[
                                                index % fallbackImages.length
                                            ]
                                        }
                                        alt={item.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.035]"
                                    />
                                    <span className="toy-handwritten absolute top-3 right-4 text-[1.7rem] text-[#061B5B]">
                                        {badgeLabel(item.badge, item.id)}
                                    </span>
                                </div>
                            </Link>

                            <div className="mt-4 flex min-h-[218px] flex-col">
                                <Link href={productHref} className="block">
                                    <h3 className="text-[1.55rem] leading-[1.1] font-black text-[#061B5B]">
                                        {item.title}
                                    </h3>
                                </Link>
                                <p className="mt-2 text-sm font-semibold text-[#26345E]">
                                    {item.collection ||
                                        item.category ||
                                        item.sku ||
                                        'Toy favorite'}
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-[#061B5B]">
                                    <span className="flex items-center gap-0.5 text-[#FF8A00]">
                                        {Array.from({ length: 5 }).map(
                                            (_, starIndex) => (
                                                <Star
                                                    key={starIndex}
                                                    size={16}
                                                    fill="currentColor"
                                                    strokeWidth={0}
                                                />
                                            ),
                                        )}
                                    </span>
                                    <span>{rating.score}</span>
                                    <span>({rating.reviews})</span>
                                </div>
                                <p className="mt-3 text-[1.85rem] leading-none font-black text-[#061B5B]">
                                    {formatPrice(item.sale_price ?? item.price)}
                                </p>
                                <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                                    <Link
                                        href={productHref}
                                        className="toy-btn-secondary"
                                    >
                                        More Info
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.visit(productHref)
                                        }
                                        className="toy-btn-primary"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </FadeInOnScroll>
    );
}

function FloatingActions() {
    const scrollToHelp = () => {
        document.getElementById('product-help')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed right-5 bottom-20 z-30 hidden flex-col gap-3 lg:flex">
            <button
                type="button"
                onClick={scrollToHelp}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#061B5B] text-white shadow-[0_8px_24px_rgba(6,27,91,0.22)] transition hover:bg-[#1F7AE5]"
                aria-label="Jump to shipping and help"
            >
                <Bell size={24} strokeWidth={2} />
            </button>
            <button
                type="button"
                onClick={scrollToTop}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#061B5B] bg-white text-[#061B5B] shadow-subtle transition hover:border-[#1F7AE5] hover:text-[#1F7AE5]"
                aria-label="Back to top"
            >
                <ChevronUp size={20} strokeWidth={2.2} />
            </button>
        </div>
    );
}

function SizeGuideModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#061B5B]/55 px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(6,27,91,0.22)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-hairline px-5 py-4 sm:px-6">
                    <div>
                        <p className="toy-handwritten text-[1.45rem] text-[#EF2B2D]">
                            Size Guide
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#6F7691]">
                            Double-check the fit before you add it to cart.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong text-[#061B5B] transition hover:border-[#061B5B]"
                        aria-label="Close size guide"
                    >
                        <X size={18} strokeWidth={2.2} />
                    </button>
                </div>
                <div className="max-h-[calc(90vh-84px)] overflow-auto bg-[#FAFAFA] p-4 sm:p-5">
                    <img
                        src="/size-guide.webp"
                        alt="Size guide"
                        className="mx-auto h-auto w-full max-w-full rounded-[20px] bg-white object-contain"
                    />
                </div>
            </div>
        </div>
    );
}

function FadeInOnScroll({
    children,
    className = '',
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
