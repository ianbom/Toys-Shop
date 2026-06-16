import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronRight,
    Heart,
    Shield,
    Sparkles,
    Star,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import ShopLayout from '@/layouts/shop-layout';
import { detail, list } from '@/routes';

type ProductCard = {
    id: number;
    slug: string;
    name: string;
    price: number;
    sale_price: number | null;
    badge?: string | null;
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

type CategoryFeature = {
    title: string;
    description: string;
    image: string;
    href: string;
};

type AgeCard = {
    title: string;
    image: string;
    tint: string;
};

type GiftCard = {
    title: string;
    body: string;
    image: string;
    href: string;
};

const fallbackProductImages = [
    '/img/abdul-raheem-kannath-aNWfK46QWto-unsplash.webp',
    '/img/ainur-iman-qcNmigFPTQM-unsplash.webp',
    '/img/atiyeh-fathi-CvdzGjVX9DA-unsplash.webp',
    '/img/hasan-almasi-_X2UAmIcpko-unsplash.webp',
    '/img/ike-ellyana-2F70bGqQVa4-unsplash.webp',
];

const toyPhotography = {
    hero: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1400&auto=format&fit=crop',
    promo: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop',
    categoryBaby:
        'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=800&auto=format&fit=crop',
    categoryPretend:
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=800&auto=format&fit=crop',
    categoryLearning:
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop',
    categoryPuzzle:
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop',
    categoryCraft:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop',
    categoryOutdoor:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop',
    ageBaby:
        'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=900&auto=format&fit=crop',
    ageOne: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=900&auto=format&fit=crop',
    ageTwo: 'https://images.unsplash.com/photo-1519340333755-c1aa5571fd46?q=80&w=900&auto=format&fit=crop',
    ageThree:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=900&auto=format&fit=crop',
    ageSix: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=900&auto=format&fit=crop',
    giftAge:
        'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=1200&auto=format&fit=crop',
    giftInterest:
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop',
    giftBudget:
        'https://images.unsplash.com/photo-1481391032119-d89fee407e44?q=80&w=1200&auto=format&fit=crop',
};

const ageCards: AgeCard[] = [
    {
        title: '0–12 Months',
        image: toyPhotography.ageBaby,
        tint: 'from-[#D6ECFF] to-[#B8DDFD]',
    },
    {
        title: '1–2 Years',
        image: toyPhotography.ageOne,
        tint: 'from-[#E7F5DA] to-[#D5EEBE]',
    },
    {
        title: '2–3 Years',
        image: toyPhotography.ageTwo,
        tint: 'from-[#FFF1CC] to-[#FFE3A6]',
    },
    {
        title: '3–5 Years',
        image: toyPhotography.ageThree,
        tint: 'from-[#FFE2E8] to-[#FFD0DB]',
    },
    {
        title: '6–8 Years',
        image: toyPhotography.ageSix,
        tint: 'from-[#E9DEFF] to-[#DCC8FF]',
    },
];

const playFeatures = [
    {
        title: 'Imaginative play',
        body: 'Encourages creativity and open-ended imagination.',
        icon: Sparkles,
    },
    {
        title: 'Skill building',
        body: 'Supports early learning across key developmental skills.',
        icon: Star,
    },
    {
        title: 'Child-safe materials',
        body: 'High-quality, non-toxic materials you can trust.',
        icon: Shield,
    },
    {
        title: 'Parent-approved design',
        body: 'Loved by kids and recommended by parents.',
        icon: Heart,
    },
];

const giftCards: GiftCard[] = [
    {
        title: 'Gifts by Age',
        body: 'Toys for every stage of growth.',
        image: toyPhotography.giftAge,
        href: list.url(),
    },
    {
        title: 'Gifts by Interest',
        body: 'From animals to art and more.',
        image: toyPhotography.giftInterest,
        href: list.url(),
    },
    {
        title: 'Gifts Under $50',
        body: 'Great toys, joyful prices.',
        image: toyPhotography.giftBudget,
        href: list.url(),
    },
];

const testimonials = [
    {
        quote: 'The toys are beautiful, safe, and our kids absolutely love them. Fast shipping too.',
        name: 'Jessica M.',
    },
    {
        quote: 'We love the educational toys that actually keep our toddler engaged. Amazing quality.',
        name: 'David R.',
    },
    {
        quote: 'Beautifully made toys that grow with our child. Our go-to place for gifts.',
        name: 'Sarah T.',
    },
];

const fallbackProducts: ProductCard[] = [
    {
        id: 901,
        slug: 'ocean-adventure-play-gym',
        name: 'Ocean Adventure Play Gym',
        price: 959840,
        sale_price: null,
        badge: 'BEST SELLER',
        label: 'BEST SELLER',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop',
        category: 'Baby Toys',
        collection: 'Best Sellers',
        colors: [],
    },
    {
        id: 902,
        slug: 'abc-learning-blocks',
        name: 'ABC & 123 Learning Blocks',
        price: 479840,
        sale_price: null,
        badge: 'NEW',
        label: 'NEW',
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop',
        category: 'Learning Toys',
        collection: 'New Arrivals',
        colors: [],
    },
    {
        id: 903,
        slug: 'berry-buddy-take-along-toy',
        name: 'Berry Buddy Take-Along Toy',
        price: 239840,
        sale_price: null,
        badge: 'BEST SELLER',
        label: 'BEST SELLER',
        image: 'https://images.unsplash.com/photo-1563901935883-cb291c7af1de?q=80&w=1200&auto=format&fit=crop',
        category: 'Travel Toys',
        collection: 'Best Sellers',
        colors: [],
    },
    {
        id: 904,
        slug: 'sort-stack-shape-puzzle',
        name: 'Sort & Stack Shape Puzzle',
        price: 319840,
        sale_price: null,
        badge: 'NEW',
        label: 'NEW',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop',
        category: 'Puzzles',
        collection: 'New Arrivals',
        colors: [],
    },
];

const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(Math.max(1, value / 16000));

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
    const raw = product.badge ?? product.label;

    if (raw) {
        if (raw === 'DISCOUNT') {
            return 'Sale';
        }

        return raw
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/(^|\s)\S/g, (value) => value.toUpperCase());
    }

    return product.id % 2 === 0 ? 'New' : 'Best Seller';
};

const fallbackCategoryCards: CategoryFeature[] = [
    {
        title: 'Baby Toys',
        description: 'Safe, gentle and made for little discoveries.',
        image: toyPhotography.categoryBaby,
        href: list.url(),
    },
    {
        title: 'Pretend Play',
        description: 'Spark imagination with role play favorites.',
        image: toyPhotography.categoryPretend,
        href: list.url(),
    },
    {
        title: 'Learning Toys',
        description: 'Build skills through fun, hands-on play.',
        image: toyPhotography.categoryLearning,
        href: list.url(),
    },
    {
        title: 'Puzzles',
        description: 'Brain-boosting puzzles for every curious mind.',
        image: toyPhotography.categoryPuzzle,
        href: list.url(),
    },
    {
        title: 'Arts & Crafts',
        description: 'Create, color and craft endless masterpieces.',
        image: toyPhotography.categoryCraft,
        href: list.url(),
    },
    {
        title: 'Outdoor Fun',
        description: 'Active play for bright smiles outside.',
        image: toyPhotography.categoryOutdoor,
        href: list.url(),
    },
];

function productImage(product: ProductCard, index: number) {
    return (
        product.image ??
        fallbackProductImages[index % fallbackProductImages.length]
    );
}

export default function Home({
    categories,
    recentAdditions,
    mostLoved,
}: Props) {
    const bestSellerProducts = useMemo(() => {
        const merged = [...mostLoved, ...recentAdditions, ...fallbackProducts];
        const seen = new Set<number>();

        return merged
            .filter((product) => {
                if (seen.has(product.id)) {
                    return false;
                }

                seen.add(product.id);

                return true;
            })
            .slice(0, 4);
    }, [mostLoved, recentAdditions]);

    const categoryCards = useMemo(() => {
        const mapped = categories.slice(0, 6).map((category, index) => ({
            title: category.name,
            description:
                fallbackCategoryCards[index]?.description ??
                'Playful picks for curious little minds.',
            image:
                category.image_url ??
                fallbackCategoryCards[index]?.image ??
                fallbackCategoryCards[0].image,
            href: list.url({ query: { category: category.slug } }),
        }));

        return [...mapped, ...fallbackCategoryCards].slice(0, 6);
    }, [categories]);

    return (
        <ShopLayout>
            <Head title="Little Toy Toys - Play, Learn, and Grow Every Day" />

            <section className="relative mx-auto max-w-[1440px] px-4 pt-6 pb-16 sm:px-6 lg:px-8 lg:pt-8 lg:pb-20">
                <div className="toy-doodle-star absolute top-18 left-2 hidden h-10 w-10 lg:block" />
                <div className="toy-doodle-loop absolute top-[38rem] left-0 hidden h-10 w-10 lg:block" />
                <div className="toy-doodle-swirl absolute top-24 right-0 hidden h-10 w-10 lg:block" />
                <div className="toy-doodle-star absolute top-[68rem] right-10 hidden h-10 w-10 xl:block" />

                <HeroSection />
                <CategoryFeatureRow cards={categoryCards} />
                <AgeExplorer />
                <BestSellersSection products={bestSellerProducts} />
                <MeaningfulPlaySection />
                <NewArrivalsPromo />
                <GiftGuideSection />
                <TestimonialsSection />
                {/* <PlaytimeNewsletter /> */}
            </section>
        </ShopLayout>
    );
}

function HeroSection() {
    return (
        <section className="toy-card relative overflow-hidden rounded-[32px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-32 rounded-full bg-[#A9D8F6]/35 blur-3xl" />
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                <FadeInOnScroll className="relative z-10">
                    <p className="toy-handwritten text-[2rem] text-[#EF2B2D]">
                        Playtime starts here
                    </p>
                    <h1 className="mt-3 max-w-[12ch] text-[2.7rem] leading-[0.98] font-black text-[#061B5B] sm:text-[3.45rem] lg:text-[4.5rem]">
                        Play, Learn, and Grow Every Day
                    </h1>
                    <p className="mt-5 max-w-[32rem] text-base leading-7 font-semibold text-[#26345E] sm:text-lg">
                        Thoughtfully designed toys that inspire imagination,
                        creativity, and early learning for every bright little
                        mind.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={list.url({ query: { type: 'best_seller' } })}
                            className="toy-btn-primary rounded-full px-8"
                        >
                            Shop Best Sellers
                        </Link>
                        <Link
                            href={list.url()}
                            className="toy-btn-secondary rounded-full px-8"
                        >
                            Explore by Age
                        </Link>
                    </div>
                </FadeInOnScroll>

                <FadeInOnScroll className="relative" delay={120}>
                    <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#FFF8EF_0%,#FFFFFF_48%,#FFF5F8_100%)] p-4 sm:p-6 lg:p-8">
                        <div className="pointer-events-none absolute top-8 left-6 h-28 w-28 rounded-full bg-[#FFC94A]/20 blur-3xl" />
                        <div className="pointer-events-none absolute right-8 bottom-10 h-24 w-24 rounded-full bg-[#A9D8F6]/35 blur-3xl" />
                        <div className="grid gap-4 sm:grid-cols-[0.78fr_1.22fr] sm:items-end">
                            <div className="rounded-[24px] bg-white/75 p-3 shadow-subtle backdrop-blur-sm">
                                <img
                                    src={toyPhotography.hero}
                                    alt="Child playing with colorful educational toys"
                                    className="aspect-[0.9] w-full rounded-[18px] object-cover object-center"
                                />
                            </div>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <ToyShowcaseCard
                                        image="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=900&auto=format&fit=crop"
                                        title="ABC Blocks"
                                    />
                                    <ToyShowcaseCard
                                        image="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=900&auto=format&fit=crop"
                                        title="Shape Puzzle"
                                    />
                                </div>
                                <div className="rounded-[24px] bg-white px-5 py-4 shadow-subtle">
                                    <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1563901935883-cb291c7af1de?q=80&w=900&auto=format&fit=crop"
                                            alt="Smiling strawberry-themed toy"
                                            className="aspect-[1.25] w-full rounded-[20px] object-cover"
                                        />
                                        <div>
                                            <p className="toy-handwritten text-[1.8rem] text-[#061B5B]">
                                                Bright picks
                                            </p>
                                            <p className="mt-2 text-sm leading-6 font-semibold text-[#26345E]">
                                                Stack, sort, imagine, and learn
                                                with friendly favorites ready
                                                for gifting.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInOnScroll>
            </div>
        </section>
    );
}

function ToyShowcaseCard({ image, title }: { image: string; title: string }) {
    return (
        <div className="rounded-[22px] bg-white p-3 shadow-subtle">
            <img
                src={image}
                alt={title}
                className="aspect-[1.1] w-full rounded-[16px] object-cover"
            />
            <p className="mt-3 text-sm font-black text-[#061B5B]">{title}</p>
        </div>
    );
}

function CategoryFeatureRow({ cards }: { cards: CategoryFeature[] }) {
    return (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {cards.map((card, index) => (
                <FadeInOnScroll
                    key={`${card.title}-${index}`}
                    delay={index * 40}
                >
                    <Link
                        href={card.href}
                        className="toy-card group flex h-full flex-col overflow-hidden p-3 transition-transform hover:-translate-y-1"
                    >
                        <img
                            src={card.image}
                            alt={card.title}
                            className="aspect-[1.25] w-full rounded-[18px] object-cover"
                        />
                        <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
                            <h2 className="text-[1.15rem] leading-tight font-black text-[#061B5B]">
                                {card.title}
                            </h2>
                            <p className="mt-2 flex-1 text-sm leading-6 font-semibold text-[#26345E]">
                                {card.description}
                            </p>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#061B5B] group-hover:text-[#1F7AE5]">
                                Shop Now
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </span>
                        </div>
                    </Link>
                </FadeInOnScroll>
            ))}
        </section>
    );
}

function AgeExplorer() {
    return (
        <section className="mt-12">
            <SectionHeader
                title="Shop by Age"
                action="View All"
                href={list.url()}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {ageCards.map((card, index) => (
                    <FadeInOnScroll key={card.title} delay={index * 40}>
                        <Link
                            href={list.url()}
                            className={`block overflow-hidden rounded-[28px] bg-gradient-to-br ${card.tint} p-5 shadow-subtle`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="max-w-[8ch] text-[2rem] leading-[1.05] font-black text-[#061B5B]">
                                    {card.title}
                                </h3>
                                <span className="text-2xl text-white/85">
                                    ☆
                                </span>
                            </div>
                            <div className="mt-5 flex items-end justify-between gap-4">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#061B5B] shadow-subtle">
                                    <ArrowRight size={18} strokeWidth={2.3} />
                                </span>
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="h-32 w-32 rounded-full object-cover object-center shadow-subtle"
                                />
                            </div>
                        </Link>
                    </FadeInOnScroll>
                ))}
            </div>
        </section>
    );
}

function BestSellersSection({ products }: { products: ProductCard[] }) {
    return (
        <section className="mt-14">
            <SectionHeader
                title="Best Sellers"
                action="View All"
                href={list.url({ query: { type: 'best_seller' } })}
                centered
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product, index) => (
                    <FadeInOnScroll
                        key={`${product.id}-${product.slug}`}
                        delay={index * 45}
                    >
                        <HomepageProductCard product={product} index={index} />
                    </FadeInOnScroll>
                ))}
            </div>
        </section>
    );
}

function HomepageProductCard({
    product,
    index,
}: {
    product: ProductCard;
    index: number;
}) {
    const href = detail.url({ query: { product: product.slug } });
    const rating = ratingForProduct(product);

    return (
        <article className="toy-card group overflow-hidden p-4 pb-5 sm:p-5">
            <Link href={href} className="block">
                <div className="relative aspect-[0.95] overflow-hidden rounded-[18px] bg-white p-5">
                    <img
                        src={productImage(product, index)}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.035]"
                    />
                    <span className="toy-handwritten absolute top-3 right-4 text-[1.75rem] text-[#061B5B]">
                        {badgeLabel(product)}
                    </span>
                </div>
            </Link>
            <div className="mt-4 flex min-h-[220px] flex-col">
                <Link href={href} className="block">
                    <h3 className="text-[1.55rem] leading-[1.08] font-black text-[#061B5B]">
                        {product.name}
                    </h3>
                </Link>
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
                <p className="mt-2 text-sm font-semibold text-[#26345E]">
                    {product.collection ??
                        product.category ??
                        'Playtime favorite'}
                </p>
                <p className="mt-3 text-[1.85rem] leading-none font-black text-[#061B5B]">
                    {formatPrice(product.sale_price ?? product.price)}
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                    <Link href={href} className="toy-btn-secondary">
                        More Info
                    </Link>
                    <Link href={href} className="toy-btn-primary">
                        Add to Cart
                    </Link>
                </div>
            </div>
        </article>
    );
}

function MeaningfulPlaySection() {
    return (
        <section className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <FadeInOnScroll className="pt-2">
                <p className="toy-handwritten text-[1.85rem] text-[#EF2B2D]">
                    Play with purpose
                </p>
                <h2 className="mt-3 max-w-[11ch] text-[2.7rem] leading-[1.02] font-black text-[#061B5B] sm:text-[3.25rem]">
                    Made for Meaningful Play
                </h2>
                <p className="mt-5 max-w-[34rem] text-base leading-7 font-semibold text-[#26345E]">
                    We believe play is how children learn best. Our toys are
                    crafted to spark curiosity, build skills, and create joyful
                    moments that last a lifetime.
                </p>
            </FadeInOnScroll>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
                {playFeatures.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                        <FadeInOnScroll key={feature.title} delay={index * 45}>
                            <div className="toy-card h-full px-5 py-6 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF7FF] text-[#061B5B] shadow-subtle">
                                    <Icon size={28} strokeWidth={2} />
                                </div>
                                <h3 className="mt-4 text-[1.1rem] font-black text-[#061B5B]">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 font-semibold text-[#26345E]">
                                    {feature.body}
                                </p>
                            </div>
                        </FadeInOnScroll>
                    );
                })}
            </div>
        </section>
    );
}

function NewArrivalsPromo() {
    return (
        <FadeInOnScroll className="mt-14">
            <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#FFF9EF_0%,#FFFFFF_55%,#F3FAFF_100%)] p-6 shadow-subtle sm:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <img
                        src={toyPhotography.promo}
                        alt="Wooden animal toys lined up on a play table"
                        className="w-full rounded-[26px] object-cover lg:min-h-[320px]"
                    />
                    <div>
                        <p className="toy-handwritten text-[2rem] text-[#EF2B2D]">
                            New!
                        </p>
                        <h2 className="mt-2 max-w-[12ch] text-[2.5rem] leading-[1.02] font-black text-[#061B5B] sm:text-[3.25rem]">
                            New Arrivals for Curious Little Minds
                        </h2>
                        <p className="mt-4 max-w-[30rem] text-base leading-7 font-semibold text-[#26345E]">
                            Fresh, fun, and educational toys that spark wonder
                            and inspire bright everyday adventures at home.
                        </p>
                        <Link
                            href={list.url({ query: { type: 'new_arrival' } })}
                            className="toy-btn-primary mt-7 rounded-full px-8"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        </FadeInOnScroll>
    );
}

function GiftGuideSection() {
    return (
        <section className="mt-14">
            <SectionHeader
                title="Find the Perfect Gift"
                action="View All"
                href={list.url()}
                centered
            />
            <div className="grid gap-5 lg:grid-cols-3">
                {giftCards.map((card, index) => (
                    <FadeInOnScroll key={card.title} delay={index * 45}>
                        <Link
                            href={card.href}
                            className="toy-card group block overflow-hidden p-3"
                        >
                            <img
                                src={card.image}
                                alt={card.title}
                                className="aspect-[1.45] w-full rounded-[20px] object-cover"
                            />
                            <div className="flex items-end justify-between gap-4 px-2 pt-5 pb-2">
                                <div>
                                    <h3 className="text-[1.4rem] leading-tight font-black text-[#061B5B]">
                                        {card.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 font-semibold text-[#26345E]">
                                        {card.body}
                                    </p>
                                </div>
                                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#061B5B] text-[#061B5B] group-hover:border-[#1F7AE5] group-hover:text-[#1F7AE5]">
                                    <ArrowRight size={18} strokeWidth={2.4} />
                                </span>
                            </div>
                        </Link>
                    </FadeInOnScroll>
                ))}
            </div>
        </section>
    );
}

function TestimonialsSection() {
    return (
        <section className="mt-14">
            <SectionHeader
                title="Loved by Parents, Cherished by Kids"
                action="Read More"
                href={list.url()}
                centered
            />
            <div className="grid gap-4 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                    <FadeInOnScroll key={testimonial.name} delay={index * 45}>
                        <article className="toy-card flex h-full gap-4 p-5">
                            <img
                                src={`https://i.pravatar.cc/120?img=${index + 12}`}
                                alt={testimonial.name}
                                className="h-16 w-16 shrink-0 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm leading-7 font-semibold text-[#26345E]">
                                    “{testimonial.quote}”
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="flex items-center gap-0.5 text-[#FF8A00]">
                                        {Array.from({ length: 5 }).map(
                                            (_, starIndex) => (
                                                <Star
                                                    key={starIndex}
                                                    size={15}
                                                    fill="currentColor"
                                                    strokeWidth={0}
                                                />
                                            ),
                                        )}
                                    </span>
                                    <span className="text-sm font-black text-[#061B5B]">
                                        — {testimonial.name}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </FadeInOnScroll>
                ))}
            </div>
        </section>
    );
}

function PlaytimeNewsletter() {
    return (
        <FadeInOnScroll className="mt-14">
            <section className="overflow-hidden rounded-[32px] bg-[#EAF6FF] px-6 py-8 shadow-subtle sm:px-8 lg:px-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="toy-handwritten text-[2rem] text-[#061B5B]">
                            Let’s Make Playtime More Joyful
                        </p>
                        <p className="mt-2 max-w-[42rem] text-base leading-7 font-semibold text-[#26345E]">
                            Join our family for special offers, new arrivals,
                            and playful inspiration picked for curious little
                            minds.
                        </p>
                    </div>
                    <form
                        className="flex w-full max-w-[520px] flex-col gap-3 sm:flex-row"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <label
                            htmlFor="homepage-newsletter"
                            className="sr-only"
                        >
                            Email address
                        </label>
                        <input
                            id="homepage-newsletter"
                            type="email"
                            placeholder="Enter your email address"
                            className="h-13 flex-1 rounded-full border border-hairline-strong bg-white px-5 text-base font-semibold text-[#061B5B] placeholder:text-[#6F7691] focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="toy-btn-primary rounded-full px-8"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </FadeInOnScroll>
    );
}

function SectionHeader({
    title,
    action,
    href,
    centered = false,
}: {
    title: string;
    action: string;
    href: string;
    centered?: boolean;
}) {
    return (
        <div
            className={`mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end ${centered ? 'sm:justify-between' : 'sm:justify-between'}`}
        >
            <div className={centered ? 'sm:mx-auto sm:text-center' : ''}>
                <h2 className="text-[2.35rem] leading-[1.03] font-black text-[#061B5B] sm:text-[3rem]">
                    {title}
                </h2>
            </div>
            <Link
                href={href}
                className="inline-flex items-center gap-2 text-sm font-black text-[#061B5B] hover:text-[#1F7AE5] sm:self-center"
            >
                {action}
                <ChevronRight size={18} strokeWidth={2.5} />
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
