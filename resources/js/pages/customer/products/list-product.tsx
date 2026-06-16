import { Head, InfiniteScroll, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Heart,
    Search,
    SlidersHorizontal,
    Star,
    X,
} from 'lucide-react';
import type { FormEvent, MouseEvent, ReactNode } from 'react';
import { memo, useEffect, useState } from 'react';

import {
    destroyProduct as removeWishlistProduct,
    store as addWishlistItem,
} from '@/actions/App/Http/Controllers/Customer/WishlistController';
import ShopLayout from '@/layouts/shop-layout';
import { detail, list, login } from '@/routes';

type FilterState = {
    search: string;
    category: string;
    collection: string;
    type: string;
    availability: string;
    price: string;
    color: string;
    size: string;
    sort: string;
    order: string;
    per_page: string;
};

type ProductCard = {
    id: number;
    slug: string;
    title: string;
    sku: string | null;
    price: number;
    sale_price: number | null;
    image: string | null;
    hover_image: string | null;
    badge: string | null;
    category: string | null;
    collection: string | null;
    colors: Array<{
        name: string | null;
        hex: string;
    }>;
    sizes: string[];
    available_stock: number;
    is_wishlisted: boolean;
};

type PaginatedProducts = {
    data: ProductCard[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    per_page: number;
    to: number | null;
    total: number;
};

type FilterOption = {
    id?: number;
    name?: string | null;
    description?: string | null;
    slug?: string;
    value?: string;
    label?: string;
    hex?: string;
};

type Props = {
    products: PaginatedProducts;
    filters: Omit<FilterState, 'per_page'> & {
        per_page: number;
    };
    options: {
        categories: FilterOption[];
        collections: FilterOption[];
        colors: FilterOption[];
        sizes: string[];
        priceRanges: Array<{ value: string; label: string }>;
        sorts: Array<{ value: string; label: string }>;
    };
};

type SharedProps = {
    auth: {
        user: unknown | null;
    };
};

const defaultFilters: FilterState = {
    search: '',
    category: '',
    collection: '',
    type: 'all',
    availability: 'all',
    price: 'all',
    color: '',
    size: '',
    sort: 'featured',
    order: 'desc',
    per_page: '12',
};

const typeOptions = [
    { value: 'all', label: 'All' },
    { value: 'featured', label: 'Featured' },
    { value: 'new_arrival', label: 'New' },
    { value: 'best_seller', label: 'Best Seller' },
    { value: 'discount', label: 'Sale' },
];

const availabilityOptions = [
    { value: 'all', label: 'All' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
];

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

const cleanQuery = (filters: FilterState) =>
    Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
            if (value === '') {
                return false;
            }

            if (key === 'per_page') {
                return value !== defaultFilters.per_page;
            }

            return value !== defaultFilters[key as keyof FilterState];
        }),
    );

const titleFromFilters = (
    filters: Props['filters'],
    options: Props['options'],
) => {
    const selectedCollection = options.collections.find(
        (collection) => collection.slug === filters.collection,
    );

    if (selectedCollection?.name) {
        return selectedCollection.name;
    }

    const selectedCategory = options.categories.find(
        (category) => category.slug === filters.category,
    );

    if (selectedCategory?.name) {
        return selectedCategory.name;
    }

    if (filters.search) {
        return `Search Results for “${filters.search}”`;
    }

    return 'Baby Toys 0-12 Months';
};

const ratingForProduct = (product: ProductCard) => {
    const value = 4.6 + ((product.id % 4) * 0.1 + (product.id % 3) * 0.03);
    const rounded = Math.min(5, Math.round(value * 10) / 10);
    const reviews = 180 + (product.id % 290);

    return {
        score: rounded.toFixed(1),
        reviews,
    };
};

const badgeLabel = (product: ProductCard) => {
    if (product.badge) {
        if (product.badge === 'DISCOUNT') {
            return 'Sale';
        }

        return product.badge
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/(^|\s)\S/g, (value) => value.toUpperCase());
    }

    return product.id % 2 === 0 ? 'New' : 'Best Seller';
};

export default function ListProduct({ products, filters, options }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const isAuthenticated = Boolean(auth.user);
    const [form, setForm] = useState<FilterState>({
        ...filters,
        per_page: String(filters.per_page ?? defaultFilters.per_page),
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        if (form.search === (filters.search ?? '')) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(list.url(), cleanQuery(form), {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [filters.search, form]);

    const visit = (nextFilters: FilterState) => {
        setForm(nextFilters);
        router.get(list.url(), cleanQuery(nextFilters), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const setFilter = (key: keyof FilterState, value: string) => {
        visit({
            ...form,
            [key]: value,
        });
    };

    const resetFilters = () => {
        visit(defaultFilters);
    };

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        visit(form);
    };

    const pageTitle = titleFromFilters(filters, options);

    return (
        <ShopLayout>
            <Head title={`${pageTitle} - Little Toy Toys`} />

            <section className="relative mx-auto max-w-[1440px] px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pt-10 lg:pb-20">
                <div className="toy-doodle-star absolute top-12 left-2 hidden h-10 w-10 lg:block" />
                <div className="toy-doodle-loop absolute top-40 left-0 hidden h-10 w-10 lg:block" />
                <div className="toy-doodle-swirl absolute top-56 right-0 hidden h-10 w-10 lg:block" />

                <button
                    type="button"
                    aria-label="Close filter drawer"
                    onClick={() => setIsFilterOpen(false)}
                    className={`fixed inset-0 z-[70] bg-[#061B5B]/35 transition-opacity lg:hidden ${
                        isFilterOpen
                            ? 'opacity-100'
                            : 'pointer-events-none opacity-0'
                    }`}
                />

                <aside
                    aria-label="Mobile filters"
                    className={`fixed top-0 left-0 z-[80] flex h-full w-[min(88vw,360px)] flex-col bg-white p-5 shadow-[0_24px_60px_rgba(6,27,91,0.18)] transition-transform lg:hidden ${
                        isFilterOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="mb-5 flex items-center justify-between border-b border-hairline pb-4">
                        <h2 className="text-[1.35rem] font-black text-[#061B5B]">
                            Filter By
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(false)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#061B5B] text-[#061B5B]"
                        >
                            <X size={20} strokeWidth={2.3} />
                        </button>
                    </div>

                    <form onSubmit={submitSearch} className="relative mb-5">
                        <Search
                            className="absolute top-1/2 left-4 -translate-y-1/2 text-[#061B5B]"
                            size={20}
                            strokeWidth={2.2}
                        />
                        <input
                            type="search"
                            value={form.search}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    search: event.target.value,
                                }))
                            }
                            placeholder="Search toys"
                            className="h-12 w-full rounded-full border border-hairline-strong bg-white pr-4 pl-11 text-sm font-semibold text-[#061B5B] placeholder:text-[#6F7691] focus:outline-none"
                        />
                    </form>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                        <MobileFilterGroup title="Age">
                            <FilterSelect
                                value={form.category}
                                onChange={(value) =>
                                    setFilter('category', value)
                                }
                                options={[
                                    { value: '', label: 'All Ages' },
                                    ...options.categories.map((category) => ({
                                        value: category.slug ?? '',
                                        label: category.name ?? 'Untitled',
                                    })),
                                ]}
                            />
                        </MobileFilterGroup>
                        <MobileFilterGroup title="Category">
                            <FilterSelect
                                value={form.collection}
                                onChange={(value) =>
                                    setFilter('collection', value)
                                }
                                options={[
                                    { value: '', label: 'All Categories' },
                                    ...options.collections.map(
                                        (collection) => ({
                                            value: collection.slug ?? '',
                                            label:
                                                collection.name ?? 'Untitled',
                                        }),
                                    ),
                                ]}
                            />
                        </MobileFilterGroup>

                        <MobileFilterGroup title="Price">
                            <FilterSelect
                                value={form.price}
                                onChange={(value) => setFilter('price', value)}
                                options={[
                                    { value: 'all', label: 'Any Price' },
                                    ...options.priceRanges,
                                ]}
                            />
                        </MobileFilterGroup>
                        <MobileFilterGroup title="Availability">
                            <FilterSelect
                                value={form.availability}
                                onChange={(value) =>
                                    setFilter('availability', value)
                                }
                                options={availabilityOptions}
                            />
                        </MobileFilterGroup>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-hairline pt-4">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="toy-btn-secondary"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(false)}
                            className="toy-btn-primary"
                        >
                            Apply
                        </button>
                    </div>
                </aside>

                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold text-[#061B5B]"
                >
                    <Link href="/" className="hover:text-[#1F7AE5]">
                        Home
                    </Link>
                    <span className="text-[#6F7691]">›</span>
                    <span>Shop By Age</span>
                    <span className="text-[#6F7691]">›</span>
                    <span>{pageTitle}</span>
                </nav>

                <header className="mb-8 text-center">
                    <h1 className="mx-auto max-w-4xl text-[2.7rem] leading-[1.02] font-black text-[#061B5B] sm:text-[3.25rem] lg:text-[4rem]">
                        {pageTitle}
                    </h1>
                </header>

                <div className="mb-8 flex flex-col gap-4 rounded-[24px] bg-white/90 p-4 shadow-subtle lg:flex-row lg:items-center lg:justify-between lg:p-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="mr-1 text-lg font-black text-[#061B5B]">
                            Filter By
                        </span>
                        <form
                            onSubmit={submitSearch}
                            className="relative min-w-[220px] flex-1 lg:w-[280px] lg:flex-none"
                        >
                            <Search
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#061B5B]"
                                size={18}
                            />
                            <input
                                type="search"
                                value={form.search}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        search: event.target.value,
                                    }))
                                }
                                placeholder="Search toys"
                                className="h-11 w-full rounded-[12px] border border-hairline bg-[#F5F5F5] pr-4 pl-10 text-sm font-bold text-[#061B5B] placeholder:text-[#6F7691] focus:outline-none"
                            />
                        </form>
                        <FilterSelect
                            value={form.category}
                            onChange={(value) => setFilter('category', value)}
                            options={[
                                { value: '', label: 'Age' },
                                ...options.categories.map((category) => ({
                                    value: category.slug ?? '',
                                    label: category.name ?? 'Untitled',
                                })),
                            ]}
                        />
                        <FilterSelect
                            value={form.collection}
                            onChange={(value) => setFilter('collection', value)}
                            options={[
                                { value: '', label: 'Category' },
                                ...options.collections.map((collection) => ({
                                    value: collection.slug ?? '',
                                    label: collection.name ?? 'Untitled',
                                })),
                            ]}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(true)}
                            className="toy-btn-secondary gap-2 lg:hidden"
                        >
                            <SlidersHorizontal size={18} strokeWidth={2.2} />
                            Filter & Sort
                        </button>
                        <p className="text-[1.15rem] font-black text-[#061B5B]">
                            {products.total} Items
                        </p>
                        <FilterSelect
                            value={form.sort}
                            onChange={(value) => setFilter('sort', value)}
                            options={options.sorts.map((sort, index) => ({
                                value: sort.value,
                                label:
                                    index === 0
                                        ? `Sort By: ${sort.label}`
                                        : sort.label,
                            }))}
                            className="min-w-[220px]"
                        />
                    </div>
                </div>

                {products.data.length > 0 ? (
                    <ProductGrid
                        products={products.data}
                        isAuthenticated={isAuthenticated}
                    />
                ) : (
                    <div className="toy-card flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                        <p className="text-2xl font-black text-[#061B5B]">
                            No toys found
                        </p>
                        <p className="mt-3 max-w-md text-base leading-7 font-semibold text-[#26345E]">
                            Try another keyword or clear your filters to see
                            more playful picks.
                        </p>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="toy-btn-primary mt-6"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </section>
        </ShopLayout>
    );
}

function FilterSelect({
    value,
    onChange,
    options,
    className = '',
}: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    className?: string;
}) {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="toy-toolbar-chip w-full appearance-none pr-10 focus:outline-none"
            >
                {options.map((option) => (
                    <option
                        key={`${option.value}-${option.label}`}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#061B5B]"
                size={18}
                strokeWidth={2.4}
            />
        </div>
    );
}

function MobileFilterGroup({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div>
            <p className="mb-2 text-sm font-black tracking-[0.04em] text-[#061B5B] uppercase">
                {title}
            </p>
            {children}
        </div>
    );
}

const ProductGrid = memo(function ProductGrid({
    products,
    isAuthenticated,
}: {
    products: ProductCard[];
    isAuthenticated: boolean;
}) {
    return (
        <InfiniteScroll data="products" buffer={400}>
            {({ loading }) => (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {products.map((product, index) => (
                            <ProductTile
                                key={product.id}
                                product={product}
                                index={index}
                                isAuthenticated={isAuthenticated}
                            />
                        ))}
                    </div>
                    {loading && <ProductGridSkeleton />}
                </>
            )}
        </InfiniteScroll>
    );
});

function ProductGridSkeleton() {
    return (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="toy-card overflow-hidden p-5">
                    <div className="aspect-[0.95] animate-pulse rounded-[18px] bg-[#F5F5F5]" />
                    <div className="mt-4 h-6 w-4/5 animate-pulse rounded-full bg-[#F5F5F5]" />
                    <div className="mt-3 h-4 w-2/5 animate-pulse rounded-full bg-[#F5F5F5]" />
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="h-11 animate-pulse rounded-[12px] bg-[#F5F5F5]" />
                        <div className="h-11 animate-pulse rounded-[12px] bg-[#F5F5F5]" />
                    </div>
                </div>
            ))}
        </div>
    );
}

const ProductTile = memo(function ProductTile({
    product,
    index,
    isAuthenticated,
}: {
    product: ProductCard;
    index: number;
    isAuthenticated: boolean;
}) {
    const [isWishlistProcessing, setIsWishlistProcessing] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);
    const isSoldOut = product.available_stock <= 0;
    const productHref = detail.url({ query: { product: product.slug } });
    const rating = ratingForProduct(product);
    const colorLine = product.colors
        .slice(0, 2)
        .map((color) => color.name)
        .filter(Boolean)
        .join(' / ');

    const toggleWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (isWishlistProcessing) {
            return;
        }

        if (!isAuthenticated) {
            router.visit(login.url());

            return;
        }

        setIsWishlistProcessing(true);
        const previous = isWishlisted;
        setIsWishlisted(!previous);

        try {
            const response = await fetch(
                previous
                    ? removeWishlistProduct.url(product.id)
                    : addWishlistItem.url(product.id),
                {
                    method: previous ? 'DELETE' : 'POST',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            document.querySelector<HTMLMetaElement>(
                                'meta[name="csrf-token"]',
                            )?.content ?? '',
                    },
                },
            );

            if (!response.ok) {
                setIsWishlisted(previous);
            }
        } catch {
            setIsWishlisted(previous);
        } finally {
            setIsWishlistProcessing(false);
        }
    };

    return (
        <article className="toy-card group relative overflow-hidden p-4 pb-5 sm:p-5">
            <button
                type="button"
                aria-label={
                    isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                }
                onClick={toggleWishlist}
                disabled={isWishlistProcessing}
                className={`absolute top-4 left-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-subtle ${
                    isWishlisted
                        ? 'border-[#EF2B2D] text-[#EF2B2D]'
                        : 'border-hairline text-[#061B5B]'
                }`}
            >
                <Heart
                    size={18}
                    strokeWidth={2.2}
                    fill={isWishlisted ? 'currentColor' : 'none'}
                />
            </button>

            <Link href={productHref} className="block">
                <div className="relative aspect-[0.95] overflow-hidden rounded-[18px] bg-white p-6">
                    <img
                        src={
                            product.image ??
                            fallbackImages[index % fallbackImages.length]
                        }
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-contain transition duration-300 group-hover:scale-[1.035] ${
                            isSoldOut ? 'opacity-55 grayscale' : ''
                        }`}
                    />
                    <span className="toy-handwritten absolute top-3 right-4 text-[1.9rem] text-[#061B5B]">
                        {badgeLabel(product)}
                    </span>
                </div>
            </Link>

            <div className="mt-4 flex min-h-[220px] flex-col">
                <Link href={productHref} className="block">
                    <h3 className="text-[1.65rem] leading-[1.1] font-black text-[#061B5B]">
                        {product.title}
                    </h3>
                </Link>

                <p className="mt-2 text-sm font-semibold text-[#26345E]">
                    {colorLine ||
                        product.collection ||
                        product.category ||
                        product.sku ||
                        'Playtime favorite'}
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-[#061B5B]">
                    <span className="flex items-center gap-0.5 text-[#FF8A00]">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                                key={starIndex}
                                size={16}
                                fill="currentColor"
                                strokeWidth={0}
                            />
                        ))}
                    </span>
                    <span>{rating.score}</span>
                    <span>({rating.reviews})</span>
                </div>

                <p className="mt-3 text-[1.9rem] leading-none font-black text-[#061B5B]">
                    {formatPrice(product.sale_price ?? product.price)}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                    <Link href={productHref} className="toy-btn-secondary">
                        More Info
                    </Link>
                    <button
                        type="button"
                        onClick={() => router.visit(productHref)}
                        className="toy-btn-primary"
                        disabled={isSoldOut}
                    >
                        {isSoldOut ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </article>
    );
});
