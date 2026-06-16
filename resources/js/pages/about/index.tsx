import { Head, Link } from '@inertiajs/react';
import { Feather, Mountain, ShieldCheck, Target } from 'lucide-react';
import type { ComponentType } from 'react';

import ShopLayout from '@/layouts/shop-layout';

type ValueCard = {
    title: string;
    body: string;
    icon: ComponentType<{
        className?: string;
        size?: number;
        strokeWidth?: number;
    }>;
};

type DisciplineCard = {
    title: string;
    image: string;
};

type TimelineItem = {
    year: string;
    title: string;
    body: string;
};

type FeatureCard = {
    title: string;
    body: string;
    image: string;
};

type AthleteCard = {
    title: string;
    body: string;
    image?: string;
    cta?: string;
    href?: string;
};

type CollectionCard = {
    title: string;
    image: string;
    href: string;
};

const heroImage =
    'https://plus.unsplash.com/premium_photo-1661962327591-1b7072da3242?q=80&w=1306&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const storyImage =
    'https://images.unsplash.com/photo-1626130569162-f90681b6982a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const values: ValueCard[] = [
    {
        title: 'Precision Performance',
        body: 'Engineered for clarity, accuracy, and peak performance.',
        icon: Target,
    },
    {
        title: 'Athlete-Tested Design',
        body: 'Tested by athletes. Refined by real-world performance.',
        icon: ShieldCheck,
    },
    {
        title: 'Lightweight Protection',
        body: 'Lightweight materials with serious impact protection.',
        icon: Feather,
    },
    {
        title: 'Everyday Versatility',
        body: 'From training to adventure, gear that fits your every moment.',
        icon: Mountain,
    },
];

const disciplines: DisciplineCard[] = [
    {
        title: 'Moto',
        image: 'https://images.unsplash.com/photo-1558980664-10e7170b5df9?q=80&w=1100&auto=format&fit=crop',
    },
    {
        title: 'MTB',
        image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?q=80&w=1100&auto=format&fit=crop',
    },
    {
        title: 'Cycling',
        image: 'https://images.unsplash.com/photo-1716331710125-b0b849479686?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Running',
        image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=1100&auto=format&fit=crop',
    },
    {
        title: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1100&auto=format&fit=crop',
    },
    {
        title: 'Snow',
        image: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?q=80&w=1100&auto=format&fit=crop',
    },
];

const timeline: TimelineItem[] = [
    {
        year: "2010's",
        title: 'The Beginning',
        body: 'A small idea born from a passion for speed and the outdoors.',
    },
    {
        year: "2012's",
        title: 'First Collection',
        body: 'Our first line of performance eyewear launched with a focus on clarity and fit.',
    },
    {
        year: "2015's",
        title: 'Built to Perform',
        body: 'Expanded our range and community with athlete-tested, athlete-approved gear.',
    },
    {
        year: "2018's",
        title: 'Global Adventure',
        body: 'AxeGear reached athletes worldwide across every terrain and condition.',
    },
    {
        year: "2022's",
        title: 'The Future Ahead',
        body: 'Continuing to innovate for the next generation of athletes.',
    },
];

const features: FeatureCard[] = [
    {
        title: 'HD Clarity Lenses',
        body: 'High-definition optics for unmatched clarity and contrast in any condition.',
        image: 'https://images.unsplash.com/photo-1611004061856-ccc3cbe944b2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Impact Protection',
        body: 'Durable, shatter-resistant lenses built to handle extreme impact.',
        image: 'https://images.unsplash.com/photo-1707985034123-dbbed1830205?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Secure Fit',
        body: 'Ergonomic design with non-slip grip for all-day comfort and stability.',
        image: 'https://plus.unsplash.com/premium_photo-1694016219825-62a6a5697027?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Vented Design',
        body: 'Advanced airflow reduces fog and keeps you cool when it matters most.',
        image: 'https://plus.unsplash.com/premium_photo-1661870277562-53f9b176fc75?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Premium Materials',
        body: 'Lightweight, flexible, and built to last through every adventure.',
        image: 'https://images.unsplash.com/photo-1550085822-fe856d19136d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

const athletes: AthleteCard[] = [
    {
        title: 'Built on Feedback',
        body: 'We listen to athletes across the world to create gear that solves real needs.',
        image: 'https://images.unsplash.com/photo-1592247034198-9dd62e0b7a9e?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        cta: 'Learn More',
        href: '/about',
    },
    {
        title: 'Made for the Driven',
        body: "Whether you race, train, or explore, we're with you.",
        image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop',
        cta: 'Our Story',
        href: '/about',
    },
    {
        title: 'Performance Without Limits',
        body: 'Gear that adapts to you and every environment.',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',
        cta: 'Explore Gear',
        href: '/list',
    },
];

const collections: CollectionCard[] = [
    {
        title: 'Sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=900&auto=format&fit=crop',
        href: '/list?search=sunglasses',
    },
    {
        title: 'Goggles',
        image: 'https://images.unsplash.com/photo-1519764622345-23439dd774f7?q=80&w=900&auto=format&fit=crop',
        href: '/list?search=goggles',
    },
    {
        title: 'Gloves',
        image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=900&auto=format&fit=crop',
        href: '/list?search=gloves',
    },
    {
        title: 'Apparel',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
        href: '/list?search=apparel',
    },
    {
        title: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=900&auto=format&fit=crop',
        href: '/list?search=accessories',
    },
];

export default function AboutPage() {
    return (
        <ShopLayout>
            <Head>
                <title>About AxeGear Shop</title>
                <meta
                    name="description"
                    content="Learn how AxeGear Shop builds premium performance eyewear and gear for athletes who demand clarity, durability, and confidence."
                />
            </Head>

            <div className="bg-white">
                <HeroSection />
                <WhoWeAreSection />
                <ValuesSection />
                <DisciplinesSection />
                <JourneySection />
                <FeaturesSection />
                <AthletesSection />
                <CollectionsSection />
               
            </div>
        </ShopLayout>
    );
}

function HeroSection() {
    return (
        <section className="border-b border-[#D9D9D9] bg-white">
            <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[0.98fr_1.02fr]">
                <div className="flex items-center px-6 py-10 md:px-10 lg:px-14 lg:py-16">
                    <div className="max-w-[650px]">
                        <SectionTag>About AxeGear Shop</SectionTag>
                        <h1 className="mt-6 text-[52px] leading-[0.9] font-black text-[#1A1A1A] uppercase italic md:text-[74px] xl:text-[92px]">
                            Built for speed. Designed for clarity.
                        </h1>
                        <p className="mt-6 max-w-[600px] text-[18px] leading-8 font-medium text-[#2E2E2E]">
                            At AxeGear Shop, we create premium performance
                            eyewear and gear for athletes who demand clarity,
                            durability, and confidence on every ride, run, and
                            adventure.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/list"
                                className="inline-flex h-13 items-center justify-center bg-[#F58220] px-9 text-[14px] font-black tracking-[0.06em] text-white uppercase hover:bg-[#E67312]"
                            >
                                Shop Collection
                            </Link>
                            <a
                                href="#our-story"
                                className="inline-flex h-13 items-center justify-center border border-[#1A1A1A] bg-white px-9 text-[14px] font-black tracking-[0.06em] text-[#1A1A1A] uppercase hover:bg-[#1A1A1A] hover:text-white"
                            >
                                Our Story
                            </a>
                        </div>
                    </div>
                </div>

                <div className="min-h-[360px] lg:min-h-[620px]">
                    <img
                        src={heroImage}
                        alt="Cyclist wearing AxeGear performance eyewear"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}

function WhoWeAreSection() {
    return (
        <section
            id="our-story"
            className="border-b border-[#E5E5E5] bg-white px-6 py-8 md:px-10 lg:px-12 lg:py-12"
        >
            <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
                <div className="max-w-[560px]">
                    <SectionTag>Who We Are</SectionTag>
                    <h2 className="mt-5 text-[46px] leading-[0.92] font-black text-[#1A1A1A] uppercase italic md:text-[56px]">
                        Built different.
                    </h2>
                    <p className="mt-5 text-[17px] leading-8 font-medium text-[#2E2E2E]">
                        AxeGear Shop was built on a simple belief: athletes
                        deserve gear that keeps up with their drive. We design
                        high-performance eyewear and accessories that combine
                        precision engineering, athlete feedback, and modern
                        style to help you perform at your best.
                    </p>
                    <p className="mt-8 text-[17px] leading-8 font-black text-[#1A1A1A]">
                        Built Different. Built for You.
                    </p>
                </div>

                <div>
                    <img
                        src={storyImage}
                        alt="AxeGear performance eyewear on rock surface"
                        className="aspect-[16/7] w-full border border-[#E5E5E5] object-cover"
                    />
                </div>
            </div>
        </section>
    );
}

function ValuesSection() {
    return (
        <section className="border-b border-[#E5E5E5] bg-white px-6 py-8 md:px-10 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-8 flex justify-center lg:justify-start">
                    <SectionTag>What Drives Us</SectionTag>
                </div>
                <div className="grid grid-cols-1 border-y border-[#E5E5E5] sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.title}
                                className={`flex flex-col items-center px-6 py-7 text-center ${index > 0 ? 'lg:border-l lg:border-[#E5E5E5]' : ''} ${index > 1 ? 'sm:border-t sm:border-[#E5E5E5] lg:border-t-0' : ''}`}
                            >
                                <Icon
                                    size={56}
                                    strokeWidth={1.5}
                                    className="text-[#1A1A1A]"
                                />
                                <h3 className="mt-5 text-[24px] leading-tight font-black text-[#1A1A1A] uppercase">
                                    {item.title}
                                </h3>
                                <p className="mt-3 max-w-[270px] text-[15px] leading-7 font-medium text-[#2E2E2E]">
                                    {item.body}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function DisciplinesSection() {
    return (
        <section className="border-b border-[#E5E5E5] bg-white px-6 py-9 md:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-[1600px]">
                <CenteredTag>Engineered for every discipline</CenteredTag>
                <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                    {disciplines.map((item) => (
                        <article
                            key={item.title}
                            className="relative aspect-[1.55] overflow-hidden border border-[#E5E5E5]"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                            <p className="absolute right-4 bottom-3 left-4 text-[28px] leading-none font-black text-white uppercase italic md:text-[32px]">
                                {item.title}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function JourneySection() {
    return (
        <section className="border-b border-[#E5E5E5] bg-white px-6 py-9 md:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-[1600px]">
                <CenteredTag>Join Journey</CenteredTag>

                <div className="mt-9 hidden items-center px-6 lg:flex">
                    <div className="h-[2px] flex-1 bg-[#F58220]" />
                    {timeline.map((item) => (
                        <div key={item.year} className="relative flex-1">
                            <div className="mx-auto h-3 w-3 rounded-full bg-[#F58220]" />
                        </div>
                    ))}
                    <div className="h-[2px] flex-1 bg-[#F58220]" />
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-5 lg:gap-8">
                    {timeline.map((item) => (
                        <article
                            key={item.year}
                            className="border-t border-[#E5E5E5] pt-5 lg:border-t-0 lg:pt-0"
                        >
                            <p className="text-[18px] font-black text-[#F58220]">
                                {item.year}
                            </p>
                            <h3 className="mt-3 text-[24px] leading-tight font-black text-[#1A1A1A] uppercase">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-[15px] leading-7 font-medium text-[#2E2E2E]">
                                {item.body}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section className="border-b border-[#E5E5E5] bg-white px-6 py-9 md:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-[1600px]">
                <CenteredTag>Designed for Performance</CenteredTag>
                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {features.map((item) => (
                        <article
                            key={item.title}
                            className="border border-[#E5E5E5] bg-white"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="aspect-[1.5] w-full object-cover"
                            />
                            <div className="p-5">
                                <h3 className="text-[22px] leading-tight font-black text-[#1A1A1A] uppercase">
                                    {item.title}
                                </h3>
                                <p className="mt-3 text-[15px] leading-7 font-medium text-[#2E2E2E]">
                                    {item.body}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AthletesSection() {
    return (
        <section className="border-b border-[#E5E5E5] bg-white px-6 py-9 md:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-[1600px]">
                <CenteredTag>Inspired by Athletes</CenteredTag>
                <div className="mt-7 grid gap-4 lg:grid-cols-3">
                    {athletes.map((item) => (
                        <article
                            key={item.title}
                            className="grid min-h-[216px] border border-[#E5E5E5] bg-white md:grid-cols-[0.95fr_1.05fr]"
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            )}
                            <div className="flex flex-col justify-between p-5">
                                <div>
                                    <h3 className="text-[24px] leading-tight font-black text-[#1A1A1A] uppercase">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-[15px] leading-7 font-medium text-[#2E2E2E]">
                                        {item.body}
                                    </p>
                                </div>
                                {item.cta && item.href && (
                                    <Link
                                        href={item.href}
                                        className="mt-5 inline-flex items-center gap-2 text-[13px] font-black tracking-[0.06em] text-[#F58220] uppercase hover:text-[#E67312]"
                                    >
                                        {item.cta}{' '}
                                        <span aria-hidden="true">-&gt;</span>
                                    </Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CollectionsSection() {
    return (
        <section className="border-b border-[#E5E5E5] bg-white px-6 py-9 md:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-[1600px]">
                <CenteredTag>Featured Collections</CenteredTag>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {collections.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="border border-[#E5E5E5] bg-white hover:border-[#1A1A1A]"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="aspect-[1.5] w-full object-cover"
                            />
                            <div className="p-4 text-center">
                                <h3 className="text-[21px] leading-tight font-black text-[#1A1A1A] uppercase">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-[13px] font-black tracking-[0.05em] text-[#F58220] uppercase">
                                    Explore Collection{' '}
                                    <span aria-hidden="true">-&gt;</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}


function SectionTag({ children }: { children: string }) {
    return (
        <div className="inline-flex items-center gap-3 text-[13px] font-black tracking-[0.06em] text-[#1A1A1A] uppercase">
            <span className="h-[3px] w-10 bg-[#F58220]" />
            {children}
        </div>
    );
}

function CenteredTag({ children }: { children: string }) {
    return (
        <div className="flex items-center justify-center gap-3 text-center text-[14px] font-black tracking-[0.03em] text-[#1A1A1A] uppercase italic">
            <span className="h-[3px] w-8 bg-[#F58220]" />
            <span>{children}</span>
        </div>
    );
}
