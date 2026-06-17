import { AppContent } from '@/components/default/app-content';
import { AppShell } from '@/components/default/app-shell';
import { AppSidebar } from '@/components/default/app-sidebar';
import { AppSidebarHeader } from '@/components/default/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
