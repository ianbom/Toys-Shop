import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="relative flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border/50 px-6 text-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="absolute left-6 md:left-4">
                <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex min-w-0 items-center justify-center text-lg font-semibold md:text-xl">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
