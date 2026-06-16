import { Head, Link } from '@inertiajs/react';
import {
    Bike,
    Car,
    ChevronRight,
    Clock3,
    Dumbbell,
    Eye,
    Facebook,
    Flame,
    Gauge,
    Goal,
    Instagram,
    Mail,
    Medal,
    Mountain,
    Shield,
    Snowflake,
    Waves,
    Youtube,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';

import ShopLayout from '@/layouts/shop-layout';
import { detail, list } from '@/routes';

type ProductCard = {
    id: number;
    slug: string;
    name: string;
    price: number;
    sale_price: number | null;
    label: string | null;
    image: string | null;
    category: string | null;
    collection: string | null;
    colors: Array<{
        name: string | null;
        hex: string;
    }>;
};

type BannerCard = {
    id: number;
    title: string;
    subtitle: string | null;
    image_desktop_url: string;
    image_mobile_url: string | null;
    button_text: string | null;
    button_url: string | null;
} | null;

type CategoryCard = {
    name: string;
    slug: string;
    image_url: string | null;
};

type Props = {
    heroBanners: BannerCard[];
    ctaBanner: BannerCard;
    collectionBanners: BannerCard[];
    categories: CategoryCard[];
    hajjSeries: ProductCard[];
    wePresent: ProductCard[];
    recentAdditions: ProductCard[];
    mostLoved: ProductCard[];
};

type IconType = ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
}>;

const productImages = [
    'https://www.100percent.com/cdn/shop/files/59057-00001-P_1.jpg?v=1764788225&width=1100',
    'https://www.100percent.com/cdn/shop/files/SP26_SPEEDCRAFT_SL_60008-00025_3Q.jpg?v=1772487312&width=500',
    'https://www.100percent.com/cdn/shop/files/2000x2000-eComm_20PDP-Casual_Staple_20Tee_0010_Layer_2015.jpg?v=1764633157&width=1200',
    'https://www.100percent.com/cdn/shop/files/2000x2000-eComm_20PDP-Casual_Region_20Tee_0001_Layer_2030.jpg?v=1764633177&width=1200',
    'https://www.100percent.com/cdn/shop/files/FA25_LS_OS_TEE_REGION__2020142-10002_F-002.jpg?v=1764633155&width=1100',
    'https://www.100percent.com/cdn/shop/files/59057-00001-P_1.jpg?v=1764788225&width=900',
];

const campaignImages = {
    hero: 'https://images.unsplash.com/photo-1629223476921-49a9ba5c26e4?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    goggle: 'https://plus.unsplash.com/premium_photo-1661963005592-182d602c6a3f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    moto: 'https://images.unsplash.com/photo-1558980664-10e7170b5df9?q=80&w=1100&auto=format&fit=crop',
    cycling:
        'https://plus.unsplash.com/premium_photo-1661963826911-f369fa24c1a6?q=80&w=1306&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    trail: 'https://plus.unsplash.com/premium_photo-1661962729688-ee99b8528b78?q=80&w=1306&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    race: 'https://plus.unsplash.com/premium_photo-1661963253228-5058700024ea?q=80&w=1243&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    weather:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1100&auto=format&fit=crop',
};

const fallbackProducts: ProductCard[] = [
    {
        id: 901,
        slug: 'axeview-pro-speedcraft',
        name: 'AXEVIEW PRO SPEEDCRAFT',
        price: 2899000,
        sale_price: 2319000,
        label: 'SALE',
        image: productImages[0],
        category: 'Sunglasses',
        collection: 'Race Vision',
        colors: [],
    },
    {
        id: 902,
        slug: 'racevision-mx-goggle',
        name: 'RACEVISION MX GOGGLE',
        price: 2199000,
        sale_price: null,
        label: 'NEW',
        image: productImages[1],
        category: 'Goggles',
        collection: 'Moto',
        colors: [],
    },
    {
        id: 903,
        slug: 'staple-performance-tee',
        name: 'STAPLE PERFORMANCE TEE',
        price: 699000,
        sale_price: null,
        label: null,
        image: productImages[2],
        category: 'Apparel',
        collection: 'Casual',
        colors: [],
    },
    {
        id: 904,
        slug: 'region-casual-tee',
        name: 'REGION CASUAL TEE',
        price: 749000,
        sale_price: 599000,
        label: 'SALE',
        image: productImages[3],
        category: 'Apparel',
        collection: 'Lifestyle',
        colors: [],
    },
    {
        id: 905,
        slug: 'region-long-sleeve-tee',
        name: 'REGION LONG SLEEVE TEE',
        price: 899000,
        sale_price: null,
        label: 'NEW',
        image: productImages[4],
        category: 'Apparel',
        collection: 'Weather Ready',
        colors: [],
    },
    {
        id: 906,
        slug: 'axegear-lens-kit-x1',
        name: 'AXEGEAR LENS KIT X1',
        price: 1299000,
        sale_price: 999000,
        label: 'SALE',
        image: productImages[5],
        category: 'Lens Kit',
        collection: 'Essentials',
        colors: [],
    },
];

const categoryShortcuts: Array<{
    label: string;
    icon: IconType;
    href: string;
}> = [
    {
        label: 'Sunglasses',
        icon: Eye,
        href: `${list.url()}?category=sunglasses`,
    },
    {
        label: 'Moto/MTB Goggles',
        icon: Mountain,
        href: `${list.url()}?category=goggles`,
    },
    { label: 'Gloves', icon: Shield, href: `${list.url()}?category=gloves` },
    {
        label: 'Snow Goggles',
        icon: Snowflake,
        href: `${list.url()}?category=snow-goggles`,
    },
    { label: 'Casual', icon: Dumbbell, href: `${list.url()}?category=apparel` },
];

const sportCards: Array<{ name: string; image: string; icon: IconType }> = [
    { name: 'Moto', image: campaignImages.moto, icon: Flame },
    {
        name: 'MTB',
        image: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?q=80&w=900&auto=format&fit=crop',
        icon: Mountain,
    },
    { name: 'Snow', image: campaignImages.weather, icon: Snowflake },
    {
        name: 'Baseball',
        image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=900&auto=format&fit=crop',
        icon: Goal,
    },
    { name: 'Cycling', image: campaignImages.cycling, icon: Bike },
    {
        name: 'Running',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=900&auto=format&fit=crop',
        icon: Gauge,
    },
    {
        name: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=900&auto=format&fit=crop',
        icon: Mountain,
    },
    {
        name: 'Watersports',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=900&auto=format&fit=crop',
        icon: Waves,
    },
    {
        name: 'Motorsports',
        image: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=900&auto=format&fit=crop',
        icon: Car,
    },
    {
        name: 'ATV/UTV',
        image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=900&auto=format&fit=crop',
        icon: Gauge,
    },
];

const featuredCollections = [
    { title: 'Cycling Collection', image: campaignImages.cycling },
    { title: 'Trail Performance', image: campaignImages.trail },
    { title: 'Race Day Essentials', image: campaignImages.race },
    { title: 'Weather Ready Gear', image: campaignImages.weather },
];

const benefits: Array<{ title: string; body: string; icon: IconType }> = [
    {
        title: 'Ultra-light performance',
        body: 'Built for long sessions at race pace.',
        icon: Gauge,
    },
    {
        title: 'Impact protection',
        body: 'Tough lens and frame systems for hard use.',
        icon: Shield,
    },
    {
        title: 'Athlete-tested design',
        body: 'Fit, ventilation, and clarity proven outside.',
        icon: Medal,
    },
    {
        title: 'Fast shipping',
        body: 'Packed fast so your gear is ready sooner.',
        icon: Clock3,
    },
];

const formatPrice = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

const productImage = (product: ProductCard, index: number) =>
    product.image ?? productImages[index % productImages.length];

export default function Home({ recentAdditions }: Props) {
    const newArrivals = [...recentAdditions, ...fallbackProducts].slice(0, 6);

    return (
        <ShopLayout>
            <Head title="AxeGear - Performance Eyewear & Sport Gear" />

            <div className="bg-[#1A1A1A] px-4 py-2 text-center text-[11px] font-extrabold tracking-[0.08em] text-white uppercase md:text-xs">
                Mid Season Sale: Up to 20% Off Performance Eyewear{' '}
                <Link
                    href={list.url()}
                    className="text-[#F58220] underline-offset-4 hover:underline"
                >
                    Shop Now
                </Link>
            </div>

            <HeroSection />
            <CategoryStrip />
            <ShopBySport />
            <CampaignBand />
            <NewArrivals products={newArrivals} />
            <FeaturedCollections />
            <BenefitStrip />
        </ShopLayout>
    );
}

function HeroSection() {
    return (
        <section className="relative overflow-hidden border-b border-[#1A1A1A] bg-white">
            <div className="mx-auto grid min-h-[610px] max-w-[1600px] grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
                <FadeInOnScroll className="relative z-10 flex flex-col justify-center px-5 py-14 sm:px-8 lg:px-12 xl:px-16">
                    <div className="mb-6 flex items-center gap-3 text-[12px] font-extrabold tracking-[0.22em] text-[#F58220] uppercase">
                        <span className="h-1 w-10 bg-[#F58220]" />
                        Performance eyewear
                    </div>
                    <h1 className="max-w-[690px] text-[52px] leading-[0.92] font-black tracking-normal text-[#1A1A1A] uppercase sm:text-[72px] lg:text-[86px] xl:text-[96px]">
                        Built for speed. Designed for clarity.
                    </h1>
                    <p className="mt-6 max-w-[560px] text-base leading-7 font-medium text-[#2E2E2E] md:text-lg">
                        Premium sports sunglasses, moto goggles, and technical
                        gear engineered for fast days, sharp vision, and total
                        confidence.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={list.url()}
                            className="inline-flex h-12 items-center justify-center bg-[#F58220] px-8 text-sm font-extrabold tracking-[0.08em] text-white uppercase transition-colors hover:bg-[#E67312]"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href={`${list.url()}?collection=performance`}
                            className="inline-flex h-12 items-center justify-center border border-[#1A1A1A] bg-white px-8 text-sm font-extrabold tracking-[0.08em] text-[#1A1A1A] uppercase transition-colors hover:bg-[#1A1A1A] hover:text-white"
                        >
                            Explore Collection
                        </Link>
                    </div>
                    <div
                        className="mt-12 flex items-center gap-3"
                        aria-hidden="true"
                    >
                        <span className="h-1 w-12 bg-[#1A1A1A]" />
                        <span className="h-1 w-8 bg-[#CFCFCF]" />
                        <span className="h-1 w-8 bg-[#CFCFCF]" />
                    </div>
                </FadeInOnScroll>

                <FadeInOnScroll
                    className="relative min-h-[430px] overflow-hidden lg:min-h-[610px]"
                    delay={100}
                >
                    <img
                        src={campaignImages.hero}
                        alt="Cyclist wearing AxeGear performance eyewear"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
                    <div className="absolute right-5 bottom-8 max-w-[360px] -skew-x-12 bg-[#1A1A1A] px-7 py-5 text-white shadow-[10px_10px_0_#F58220] md:right-10 md:bottom-12">
                        <p className="skew-x-12 text-2xl leading-none font-black tracking-normal uppercase md:text-3xl">
                            See it. Feel it. Own it.
                        </p>
                    </div>
                </FadeInOnScroll>
            </div>
        </section>
    );
}

function CategoryStrip() {
    return (
        <section className="border-b border-[#CFCFCF] bg-white">
            <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y divide-[#E5E5E5] sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
                {categoryShortcuts.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <FadeInOnScroll key={item.label} delay={index * 45}>
                            <Link
                                href={item.href}
                                className="group flex min-h-[126px] flex-col items-center justify-center gap-3 bg-white px-4 text-center transition-colors hover:bg-[#FFF3E8]"
                            >
                                <Icon
                                    className="h-8 w-8 text-[#1A1A1A] transition-colors group-hover:text-[#F58220]"
                                    strokeWidth={1.8}
                                />
                                <span className="text-sm font-extrabold tracking-[0.08em] text-[#1A1A1A] uppercase">
                                    {item.label}
                                </span>
                            </Link>
                        </FadeInOnScroll>
                    );
                })}
            </div>
        </section>
    );
}

function ShopBySport() {
    return (
        <section className="bg-white px-4 py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-[1600px]">
                <SectionHeader
                    kicker="Find your lane"
                    title="Shop by sport"
                    action="Shop all sports"
                />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                    {sportCards.map((sport, index) => {
                        const Icon = sport.icon;

                        return (
                            <FadeInOnScroll key={sport.name} delay={index * 35}>
                                <Link
                                    href={`${list.url()}?sport=${encodeURIComponent(sport.name.toLowerCase())}`}
                                    className="group relative flex aspect-[1.02] overflow-hidden border border-[#1A1A1A] bg-[#1A1A1A]"
                                >
                                    <img
                                        src={sport.image}
                                        alt={`${sport.name} sport`}
                                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                                    <div className="relative z-10 mt-auto flex w-full items-end justify-between p-4 text-white md:p-5">
                                        <span className="text-xl font-black tracking-normal uppercase md:text-2xl">
                                            {sport.name}
                                        </span>
                                        <Icon
                                            className="h-6 w-6 text-[#F58220]"
                                            strokeWidth={2.1}
                                        />
                                    </div>
                                </Link>
                            </FadeInOnScroll>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function CampaignBand() {
    return (
        <FadeInOnScroll>
            <section className="grid min-h-[520px] grid-cols-1 overflow-hidden border-y border-[#1A1A1A] bg-[#1A1A1A] lg:grid-cols-[1fr_0.9fr_1fr]">
                <img
                    src={campaignImages.goggle}
                    alt="AxeGear goggle lens detail"
                    className="h-[320px] w-full object-cover lg:h-full"
                    loading="lazy"
                    decoding="async"
                />
                <div className="relative flex items-center justify-center bg-white px-5 py-12 lg:-mx-10 lg:skew-x-[-7deg]">
                    <div className="max-w-[460px] text-center lg:skew-x-[7deg]">
                        <div className="mb-5 text-3xl font-black tracking-[0.12em] text-[#F58220]">
                            ///
                        </div>
                        <h2 className="text-[40px] leading-[0.95] font-black tracking-normal text-[#1A1A1A] uppercase md:text-[58px]">
                            Engineered for the fastest moments
                        </h2>
                        <p className="mx-auto mt-5 max-w-[390px] text-base leading-7 font-medium text-[#2E2E2E]">
                            High-contrast lenses, locked-in fit, and
                            no-wasted-motion details for riders and athletes who
                            need instant clarity.
                        </p>
                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                href={`${list.url()}?category=goggles`}
                                className="inline-flex h-12 items-center justify-center bg-[#F58220] px-7 text-sm font-extrabold tracking-[0.08em] text-white uppercase hover:bg-[#E67312]"
                            >
                                Shop Goggles
                            </Link>
                            <Link
                                href={list.url()}
                                className="inline-flex h-12 items-center justify-center border border-[#1A1A1A] px-7 text-sm font-extrabold tracking-[0.08em] text-[#1A1A1A] uppercase hover:bg-[#1A1A1A] hover:text-white"
                            >
                                View Gear
                            </Link>
                        </div>
                    </div>
                </div>
                <img
                    src={campaignImages.moto}
                    alt="Motorsport athlete wearing performance gear"
                    className="h-[320px] w-full object-cover lg:h-full"
                    loading="lazy"
                    decoding="async"
                />
            </section>
        </FadeInOnScroll>
    );
}

function NewArrivals({ products }: { products: ProductCard[] }) {
    return (
        <section className="bg-white px-4 py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-[1600px]">
                <SectionHeader
                    kicker="Latest drop"
                    title="New arrivals"
                    action="View all"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
                    {products.map((product, index) => (
                        <ProductTile
                            key={`${product.id}-${product.slug}`}
                            product={product}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturedCollections() {
    return (
        <section className="border-y border-[#1A1A1A] bg-[#F8F8F8] px-4 py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-[1600px]">
                <SectionHeader
                    kicker="Built sets"
                    title="Featured collections"
                    action="Explore"
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {featuredCollections.map((item, index) => (
                        <FadeInOnScroll key={item.title} delay={index * 60}>
                            <Link
                                href={`${list.url()}?collection=${encodeURIComponent(item.title.toLowerCase())}`}
                                className="group relative block aspect-[4/5] overflow-hidden border border-[#1A1A1A] bg-[#1A1A1A]"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-5">
                                    <p className="mb-3 text-[12px] font-extrabold tracking-[0.18em] text-[#F58220] uppercase">
                                        Collection
                                    </p>
                                    <h3 className="text-3xl leading-none font-black tracking-normal text-white uppercase">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>
                        </FadeInOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}

function BenefitStrip() {
    return (
        <section className="bg-white">
            <div className="mx-auto grid max-w-[1600px] grid-cols-1 divide-y divide-[#E5E5E5] border-x border-[#E5E5E5] md:grid-cols-4 md:divide-x md:divide-y-0">
                {benefits.map((benefit) => {
                    const Icon = benefit.icon;

                    return (
                        <div
                            key={benefit.title}
                            className="flex min-h-[150px] items-start gap-4 px-5 py-7"
                        >
                            <Icon
                                className="mt-1 h-8 w-8 shrink-0 text-[#F58220]"
                                strokeWidth={1.9}
                            />
                            <div>
                                <h3 className="text-base font-black tracking-[0.04em] text-[#1A1A1A] uppercase">
                                    {benefit.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 font-medium text-[#707070]">
                                    {benefit.body}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function ProductTile({
    product,
    index,
}: {
    product: ProductCard;
    index: number;
}) {
    const hasSale = product.sale_price !== null;

    return (
        <FadeInOnScroll delay={index * 45}>
            <Link
                href={detail.url({ query: { product: product.slug } })}
                className="group block overflow-hidden border border-[#E5E5E5] bg-white transition-colors hover:border-[#1A1A1A]"
            >
                <div className="relative aspect-square bg-[#F8F8F8] p-4">
                    {(hasSale || product.label) && (
                        <span className="absolute top-3 right-3 z-10 bg-[#F58220] px-2.5 py-1.5 text-[11px] font-black tracking-[0.08em] text-white uppercase">
                            {hasSale ? 'Sale' : product.label}
                        </span>
                    )}
                    <img
                        src={productImage(product, index)}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
                <div className="border-t border-[#E5E5E5] p-4">
                    <p className="mb-2 min-h-[40px] text-sm leading-5 font-black tracking-normal text-[#1A1A1A] uppercase">
                        {product.name}
                    </p>
                    <p className="mb-3 text-xs font-bold tracking-[0.08em] text-[#707070] uppercase">
                        {product.category ??
                            product.collection ??
                            'AxeGear Performance'}
                    </p>
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-black">
                        <span
                            className={
                                hasSale ? 'text-[#F58220]' : 'text-[#1A1A1A]'
                            }
                        >
                            {formatPrice(product.sale_price ?? product.price)}
                        </span>
                        {hasSale && (
                            <span className="text-[#9A9A9A] line-through">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    <span className="flex h-10 items-center justify-center bg-[#1A1A1A] text-xs font-black tracking-[0.08em] text-white uppercase transition-colors group-hover:bg-[#F58220]">
                        Quick Add
                    </span>
                </div>
            </Link>
        </FadeInOnScroll>
    );
}

function SectionHeader({
    kicker,
    title,
    action,
}: {
    kicker: string;
    title: string;
    action: string;
}) {
    return (
        <div className="mb-7 flex flex-col gap-4 md:mb-9 md:flex-row md:items-end md:justify-between">
            <div>
                <p className="mb-2 text-[12px] font-extrabold tracking-[0.18em] text-[#F58220] uppercase">
                    {kicker}
                </p>
                <h2 className="text-[34px] leading-none font-black tracking-normal text-[#1A1A1A] uppercase md:text-[48px]">
                    {title}
                </h2>
            </div>
            <Link
                href={list.url()}
                className="inline-flex w-fit items-center gap-2 text-sm font-extrabold tracking-[0.08em] text-[#1A1A1A] uppercase transition-colors hover:text-[#F58220]"
            >
                {action}
                <ChevronRight size={18} strokeWidth={2.4} />
            </Link>
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
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

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
            { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
