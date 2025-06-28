import { type ReactNode } from 'react';

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate {...props}>
        {children}
    </AppLayoutTemplate>
);
