import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

interface ShopLayoutProps {
    children: ReactNode;
}

type SharedShopProps = {
    auth: {
        user: unknown | null;
    };
    shop?: {
        cart_count?: number;
        featured_collections?: Array<{
            id: number;
            name: string;
            slug: string;
        }>;
    };
};

export default function ShopLayout({ children }: ShopLayoutProps) {
    const { url, props } = usePage<SharedShopProps>();
    const cartCount = props.shop?.cart_count ?? 0;
    const featuredCollections = props.shop?.featured_collections ?? [];
    const isAuthenticated = Boolean(props.auth.user);

    return (
        <div className="toy-page-shell flex min-h-screen flex-col overflow-x-hidden bg-canvas font-sans text-ink selection:bg-[#061B5B] selection:text-white">
            <Navbar
                cartCount={cartCount}
                collections={featuredCollections}
                currentUrl={url}
                isAuthenticated={isAuthenticated}
            />
            <main className="w-full flex-grow bg-transparent">{children}</main>
            <Toaster />
            <Footer />
        </div>
    );
}
