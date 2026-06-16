import { Link } from '@inertiajs/react';
import { ArrowRight, Facebook, Instagram, Star, Youtube } from 'lucide-react';

const columns = [
    {
        title: 'Shop',
        links: [
            { label: 'Baby Toys', href: '/list' },
            { label: 'Learning Toys', href: '/list' },
            { label: 'Pretend Play', href: '/list' },
            { label: 'Puzzles', href: '/list' },
        ],
    },
    {
        title: 'About',
        links: [
            { label: 'Our Story', href: '/about' },
            { label: 'Gift Guide', href: '/list' },
            { label: 'New Arrivals', href: '/list?type=new_arrival' },
            { label: 'Best Sellers', href: '/list?type=best_seller' },
        ],
    },
    {
        title: 'Help',
        links: [
            { label: 'Shipping Policy', href: '/shipping-policy' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '/term-condition' },
            { label: 'Returns', href: '/no-return-policy' },
        ],
    },
    {
        title: 'Rewards',
        links: [
            { label: 'Play Perks', href: '#' },
            { label: 'Gift Cards', href: '#' },
            { label: 'Teacher Picks', href: '/list' },
            { label: 'Discover More', href: '/list' },
        ],
    },
];

const socialLinks = [
    { label: 'Instagram', href: '#', icon: Instagram },
    { label: 'Facebook', href: '#', icon: Facebook },
    { label: 'YouTube', href: '#', icon: Youtube },
    { label: 'Rewards', href: '#', icon: Star },
];

export default function Footer() {
    return (
        <footer className="border-t border-hairline bg-white text-[#061B5B]">
            <section className="bg-[#EAF6FF] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
                    <div>
                        <p className="text-sm font-extrabold tracking-[0.08em] text-[#1F7AE5] uppercase">
                            Stay in the play loop
                        </p>
                        <h2 className="mt-3 max-w-xl text-[2.25rem] leading-[1.04] font-black text-[#061B5B] sm:text-[3rem]">
                            Toy ideas, gift picks, and learning favorites sent
                            your way.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-7 font-semibold text-[#26345E]">
                            Join our cheerful newsletter for new arrivals,
                            birthday picks, and playful inspiration for every
                            age.
                        </p>
                    </div>

                    <form
                        className="rounded-[28px] bg-white p-3 shadow-subtle"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email address
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                id="newsletter-email"
                                type="email"
                                placeholder="Enter your email"
                                className="h-14 flex-1 rounded-full border border-hairline-strong bg-white px-5 text-base font-semibold text-[#061B5B] placeholder:text-[#6F7691] focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="toy-btn-primary gap-2 rounded-full px-7"
                            >
                                Join
                                <ArrowRight size={18} strokeWidth={2.4} />
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.15fr_repeat(4,1fr)]">
                    <div className="pr-0 lg:pr-8">
                        <Link
                            href="/"
                            className="toy-logo-oval inline-flex min-h-[74px] min-w-[220px] whitespace-nowrap px-9 text-[2.3rem] leading-none hover:opacity-95"
                        >
                            Little Toy Toys
                        </Link>
                        <p className="mt-5 max-w-sm text-base leading-7 font-semibold text-[#26345E]">
                            Bright, giftable toys that spark imagination,
                            creativity, and joyful everyday learning.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#061B5B] text-[#061B5B] hover:bg-[#061B5B] hover:text-white"
                                >
                                    <Icon size={20} strokeWidth={2} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {columns.map((column) => (
                        <section key={column.title}>
                            <h3 className="text-lg font-black text-[#061B5B]">
                                {column.title}
                            </h3>
                            <ul className="mt-5 grid gap-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[15px] font-semibold text-[#26345E] hover:text-[#1F7AE5]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </section>

            <section className="border-t border-hairline px-4 py-5 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-3 text-sm font-semibold text-[#26345E] sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Little Toy Toys. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/privacy-policy"
                            className="hover:text-[#1F7AE5]"
                        >
                            Privacy Policy
                        </Link>
                        <span className="text-[#C9D2E6]">•</span>
                        <Link
                            href="/term-condition"
                            className="hover:text-[#1F7AE5]"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </section>
        </footer>
    );
}
