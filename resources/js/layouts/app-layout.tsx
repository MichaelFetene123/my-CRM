import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { GlobalSearch } from '@/components/global-search';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <GlobalSearch />
            {children}
        </AppLayoutTemplate>
    );
}
