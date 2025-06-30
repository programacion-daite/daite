import * as React from 'react';

import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ children, variant = 'header', ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset
                {...props}
                className={cn(
                    "bg-background relative flex min-h-svh flex-1 flex-col",
                    "lg:min-h-[calc(100svh-4rem)] lg:mt-16", // For large screens, adjust height and add margin top
                    props.className
                )}
            >
                {children}
            </SidebarInset>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            {children}
        </main>
    );
}
