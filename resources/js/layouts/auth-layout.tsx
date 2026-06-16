import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';

type AuthLayoutProps = {
    title?: string;
    description?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    heroImage?: { src: string; alt: string };
    heroOverlay?: ReactNode;
    contentClassName?: string;
    children: ReactNode;
};

export default function AuthLayout({
    title,
    description,
    breadcrumbs,
    heroImage,
    heroOverlay,
    contentClassName,
    children,
}: AuthLayoutProps) {
    const resolvedHeroImage =
        heroImage ?? {
            src: '/img/login-image.png',
            alt: 'AxeGear athlete wearing mirrored performance eyewear',
        };

    return (
        <div className="min-h-svh bg-white text-[#1A1A1A]">
            <div className="grid min-h-svh bg-white lg:grid-cols-[minmax(0,1.16fr)_minmax(420px,0.84fr)]">
                <div className="relative order-2 min-h-[320px] overflow-hidden bg-[#1A1A1A] lg:order-1 lg:min-h-full">
                    <img
                        src={resolvedHeroImage.src}
                        alt={resolvedHeroImage.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/38 via-black/16 to-transparent" />
                </div>

                <div className="order-1 flex min-h-svh flex-col bg-white lg:order-2 lg:min-h-full">


                    <div className="flex flex-1 items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">
                        <div
                            className={[
                                'w-full max-w-[460px]',
                                contentClassName ?? '',
                            ].join(' ')}
                        >
                            {breadcrumbs && breadcrumbs.length > 0 && (
                                <nav
                                    aria-label="Breadcrumb"
                                    className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-[#707070]"
                                >
                                    {breadcrumbs.map((crumb, index) => (
                                        <div
                                            key={`${crumb.label}-${index}`}
                                            className="flex items-center gap-2"
                                        >
                                            {crumb.href ? (
                                                <Link
                                                    href={crumb.href}
                                                    className="transition-colors hover:text-[#F58220]"
                                                >
                                                    {crumb.label}
                                                </Link>
                                            ) : (
                                                <span
                                                    className={
                                                        index ===
                                                        breadcrumbs.length - 1
                                                            ? 'text-[#1A1A1A]'
                                                            : undefined
                                                    }
                                                >
                                                    {crumb.label}
                                                </span>
                                            )}

                                            {index <
                                                breadcrumbs.length - 1 && (
                                                <span aria-hidden="true">/</span>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            )}

                            {(title || description) && (
                                <div className="mb-7 space-y-3">
                                    {title && (
                                        <h1 className="text-[38px] leading-[0.94] font-black tracking-normal text-[#1A1A1A] uppercase sm:text-[44px]">
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p className="max-w-[34ch] text-sm leading-6 font-medium text-[#707070] sm:text-[15px]">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



