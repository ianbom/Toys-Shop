import { Head, Link } from '@inertiajs/react';
import { Bell, Heart, LogOut, MapPin, Package, User } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';

import ShopLayout from '@/layouts/shop-layout';

const SIDEBAR_NAV = [
    {
        id: 'my-profile',
        href: '/my-profile',
        label: 'Pengaturan Profil',
        mobileLabel: 'Profil',
        icon: User,
    },
    {
        id: 'list-order',
        href: '/my-order',
        label: 'Pesanan Saya',
        mobileLabel: 'Pesanan',
        icon: Package,
    },
    {
        id: 'address',
        href: '/address',
        label: 'Buku Alamat',
        mobileLabel: 'Alamat',
        icon: MapPin,
    },
    {
        id: 'wishlist',
        href: '/wishlist',
        label: 'Wishlist Saya',
        mobileLabel: 'Wishlist',
        icon: Heart,
    },
    {
        id: 'notifications',
        href: '/notifications',
        label: 'Notifikasi',
        mobileLabel: 'Notifikasi',
        icon: Bell,
    },
];

interface Breadcrumb {
    label: string;
    href?: string;
}

interface ProfileLayoutProps {
    children: ReactNode;
    title: ReactNode | string;
    pageTitle: string;
    subtitle: string;
    activePath: string;
    breadcrumbs: Breadcrumb[];
}

const heroImage =
    'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1800&auto=format&fit=crop';

export default function ProfileLayout({
    children,
    title,
    pageTitle,
    subtitle,
    activePath,
    breadcrumbs,
}: ProfileLayoutProps) {
    return (
        <ShopLayout>
            <Head title={`${pageTitle} - AxeGear`} />

            <section className="relative min-h-[190px] overflow-hidden border-b border-[#D8D8D8] bg-white md:min-h-[230px]">
                <div className="absolute inset-y-0 right-0 hidden w-[48%] md:block">
                    <img
                        src={heroImage}
                        alt="AxeGear cyclist performance profile banner"
                        className="h-full w-full object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/45 to-white/10" />
                </div>
                <div className="relative z-10 mx-auto max-w-[1760px] px-5 py-9 md:px-12 md:py-11">
                    <nav className="mb-5 flex flex-wrap items-center gap-3 text-sm font-medium text-[#1A1A1A]">
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment
                                key={`${breadcrumb.label}-${index}`}
                            >
                                {breadcrumb.href ? (
                                    <Link
                                        href={breadcrumb.href}
                                        className="transition-colors hover:text-[#F58220]"
                                    >
                                        {breadcrumb.label}
                                    </Link>
                                ) : (
                                    <span className="font-black">
                                        {breadcrumb.label}
                                    </span>
                                )}
                                {index < breadcrumbs.length - 1 && (
                                    <span className="text-[#707070]">/</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                    <h1 className="max-w-[760px] text-[46px] leading-[0.92] font-black tracking-normal text-[#1A1A1A] uppercase italic md:text-[64px] lg:text-[76px]">
                        {title}
                    </h1>
                    <p className="mt-5 max-w-[520px] text-base font-medium text-[#2E2E2E]">
                        {subtitle}
                    </p>
                    <span className="mt-6 block h-1 w-11 bg-[#F58220]" />
                </div>
            </section>

            <main className="bg-white text-[#1A1A1A]">
                <div className="mx-auto grid max-w-[1760px] grid-cols-1 lg:grid-cols-[360px_1fr]">
                    <aside className="border-b border-[#D8D8D8] px-5 py-6 md:px-12 lg:border-r lg:border-b-0 lg:px-16 lg:py-8">
                        <h2 className="mb-5 text-2xl font-black uppercase">
                            Akun Saya
                        </h2>

                        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 lg:block lg:overflow-visible lg:pb-0">
                            {SIDEBAR_NAV.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.id === activePath;

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`relative flex min-w-fit items-center gap-4 border-b border-[#D8D8D8] px-2 py-4 text-base font-medium transition-colors lg:min-w-0 lg:px-0 lg:pl-7 ${
                                            isActive
                                                ? 'text-[#F58220]'
                                                : 'text-[#1A1A1A] hover:text-[#F58220]'
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-1/2 left-0 hidden h-12 w-1 -translate-y-1/2 lg:block ${
                                                isActive
                                                    ? 'bg-[#F58220]'
                                                    : 'bg-transparent'
                                            }`}
                                        />
                                        <Icon size={26} strokeWidth={1.8} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="relative flex min-w-fit items-center gap-4 border-b border-[#D8D8D8] px-2 py-4 text-base font-medium text-[#1A1A1A] transition-colors hover:text-[#F58220] lg:min-w-0 lg:px-0 lg:pl-7"
                            >
                                <LogOut size={26} strokeWidth={1.8} />
                                <span>Keluar</span>
                            </Link>
                        </div>
                    </aside>

                    <section className="min-w-0 px-5 py-7 md:px-12 lg:px-10 lg:py-8">
                        {children}
                    </section>
                </div>
            </main>
        </ShopLayout>
    );
}
