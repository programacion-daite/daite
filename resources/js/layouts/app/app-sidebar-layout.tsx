import { type PropsWithChildren } from 'react';

import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';

export default function AppSidebarLayout({ children }: PropsWithChildren<object>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                {children}
            </AppContent>
        </AppShell>
    );
}
