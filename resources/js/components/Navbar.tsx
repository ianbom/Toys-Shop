import { Link } from '@inertiajs/react';
import {
    Accessibility,
    ChevronDown,
    CircleHelp,
    Menu,
    Search,
    ShoppingCart,
    Star,
    User,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { list, login } from '@/routes';

type NavbarCollection = {
    id: number;
    name: string;
    slug: string;
};

type NavbarProps = {
    cartCount?: number;
    collections?: NavbarCollection[];
    currentUrl?: string;
    isAuthenticated?: boolean;
};

const fallbackCategories = [
    'Shop By Age',
    'Pretend Play',
    'Learning Toys',
    'Puzzles',
    'Arts & Crafts',
    'Trains & More Toys',
    'Sale',
    'Discover',
];

const utilityLinks = [
    { label: 'Accessibility', icon: Accessibility, href: '#' },
    { label: 'Help', icon: CircleHelp, href: '#' },
    { label: 'Rewards', icon: Star, href: '#' },
];

function ToyWordmark() {
    return <span className="toy-logo-oval px-10 pb-1">Little Toy Toys</span>;
}

export default function Navbar({
    cartCount = 0,
    collections = [],
    currentUrl = '/',
    isAuthenticated = false,
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const accountHref = isAuthenticated ? '/my-profile' : login.url();
    const cartBadge = cartCount > 99 ? '99+' : String(cartCount);
    const categories = useMemo(
        () =>
            collections.length > 0
                ? collections.slice(0, 8).map((collection) => ({
                      label: collection.name,
                      href: list.url({
                          query: { collection: collection.slug },
                      }),
                  }))
                : fallbackCategories.map((label) => ({
                      label,
                      href: list.url(),
                  })),
        [collections],
    );

    const isActive = (href: string) => currentUrl === href;

    return (
        <header className="relative z-40 border-b border-hairline bg-white">
            <div className="bg-[#A9D8F6] px-4 text-[#061B5B]">
                <div className="mx-auto flex min-h-12 max-w-[1440px] items-center justify-between gap-4 text-sm font-extrabold sm:text-[18px]">
                    <span aria-hidden="true" className="text-2xl leading-none">
                        ←
                    </span>
                    <p className="text-center">
                        Enjoy Free Shipping on Orders $49+
                    </p>
                    <span aria-hidden="true" className="text-2xl leading-none">
                        →
                    </span>
                </div>
            </div>

            <div className="toy-page-shell px-4 pt-6 pb-5 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1440px]">
                    <div className="grid gap-6 lg:grid-cols-[minmax(280px,410px)_1fr_minmax(330px,420px)] lg:items-center">
                        <form
                            className="order-2 lg:order-1"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <label
                                htmlFor="storefront-search"
                                className="sr-only"
                            >
                                Search toys
                            </label>
                            <div className="relative overflow-hidden rounded-full border border-hairline-strong bg-white shadow-subtle">
                                <Search
                                    className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 text-[#061B5B]"
                                    size={28}
                                    strokeWidth={2.1}
                                />
                                <input
                                    id="storefront-search"
                                    type="search"
                                    placeholder="Search toys, puzzles, and more"
                                    className="h-14 w-full bg-transparent pr-6 pl-16 text-base font-semibold text-[#061B5B] placeholder:text-[#6F7691] focus:outline-none"
                                />
                            </div>
                        </form>

                        <div className="order-1 flex justify-center lg:order-2">
                            <Link
                                href="/"
                                aria-label="Little Toy Toys home"
                                className="inline-flex hover:opacity-90"
                            >
                                <ToyWordmark />
                            </Link>
                        </div>

                        <div className="order-3 hidden justify-end gap-5 lg:flex">
                            {utilityLinks.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="flex min-w-16 flex-col items-center gap-2 text-center text-[#061B5B] hover:text-[#1F7AE5]"
                                >
                                    <Icon size={34} strokeWidth={2} />
                                    <span className="text-sm font-extrabold">
                                        {label}
                                    </span>
                                </Link>
                            ))}
                            <Link
                                href={accountHref}
                                className="flex min-w-16 flex-col items-center gap-2 text-center text-[#061B5B] hover:text-[#1F7AE5]"
                            >
                                <User size={34} strokeWidth={2} />
                                <span className="text-sm font-extrabold">
                                    Account
                                </span>
                            </Link>
                            <Link
                                href="/my-cart"
                                className="relative flex min-w-16 flex-col items-center gap-2 text-center text-[#061B5B] hover:text-[#1F7AE5]"
                            >
                                <ShoppingCart size={38} strokeWidth={2} />
                                <span className="text-sm font-extrabold">
                                    Cart
                                </span>
                                <span className="absolute top-0 right-0 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#EF2B2D] px-1 text-xs font-black text-white">
                                    {cartBadge}
                                </span>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 lg:hidden">
                        <button
                            type="button"
                            aria-label="Open menu"
                            onClick={() => setIsOpen(true)}
                            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#061B5B] bg-white text-[#061B5B]"
                        >
                            <Menu size={24} strokeWidth={2.2} />
                        </button>
                        <div className="flex items-center gap-4 text-[#061B5B]">
                            <Link
                                href={accountHref}
                                aria-label="Account"
                                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#061B5B] bg-white"
                            >
                                <User size={24} strokeWidth={2.1} />
                            </Link>
                            <Link
                                href="/my-cart"
                                aria-label="Cart"
                                className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#061B5B] bg-white"
                            >
                                <ShoppingCart size={25} strokeWidth={2.2} />
                                <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#EF2B2D] px-1 text-[11px] font-black text-white">
                                    {cartBadge}
                                </span>
                            </Link>
                        </div>
                    </div>

                    <nav
                        className="mt-8 hidden flex-wrap items-center justify-center gap-3 xl:flex"
                        aria-label="Shop categories"
                    >
                        {categories.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`toy-pill-nav hover:bg-[#EEF7FF] ${isActive(item.href) ? 'bg-[#EEF7FF]' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div
                        className="mt-5 flex gap-3 overflow-x-auto pb-1 xl:hidden"
                        aria-label="Shop categories"
                    >
                        {categories.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="toy-pill-nav shrink-0 whitespace-nowrap"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#061B5B] px-4 py-3 text-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 text-center text-lg font-black tracking-[0.03em] uppercase">
                    <span>Play Perks Rewards</span>
                    <ChevronDown size={20} strokeWidth={2.5} />
                </div>
            </div>

            <button
                type="button"
                aria-label="Close menu overlay"
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 z-[70] bg-[#061B5B]/35 transition-opacity xl:hidden ${
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            />
            <aside
                className={`fixed top-0 left-0 z-[80] flex h-full w-[min(88vw,360px)] flex-col bg-white p-5 shadow-[0_24px_60px_rgba(6,27,91,0.22)] transition-transform xl:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="mb-5 flex items-center justify-between">
                    <ToyWordmark />
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#061B5B] text-[#061B5B]"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="mb-5 rounded-[20px] border border-hairline-strong bg-white px-4 py-3 shadow-subtle">
                    <div className="flex items-center gap-3 text-[#061B5B]">
                        <Search size={24} strokeWidth={2.1} />
                        <span className="font-semibold text-[#6F7691]">
                            Search toys, puzzles, and more
                        </span>
                    </div>
                </div>

                <nav
                    className="grid gap-3 overflow-y-auto pb-6"
                    aria-label="Mobile shop categories"
                >
                    {categories.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="toy-pill-nav justify-start"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href={accountHref}
                        onClick={() => setIsOpen(false)}
                        className="toy-pill-nav justify-start"
                    >
                        Account
                    </Link>
                </nav>
            </aside>
        </header>
    );
}
