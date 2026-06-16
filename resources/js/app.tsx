import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Anemi';
const pages = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        const module = await page();

        return (module as { default: ComponentType }).default;
    },
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name === 'home':
                return null;
            case name === 'detail':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('admin/'):
                return AppLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
