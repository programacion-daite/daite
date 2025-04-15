import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppSidebar() {
    const isMobile = useIsMobile();

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className={cn(
                "text-white", // Base styles for all screens
                "lg:flex-row lg:items-start lg:justify-between lg:px-12 lg:py-1", // Layout for large screens
            )}
        >
            <div className="flex flex-1 items-center gap-8">
                {/* <SidebarHeader className="lg:flex-row lg:items-center">
                    <Link href="/dashboard" prefetch className="lg:flex lg:items-center">
                        <AppLogo className="text-white" />
                    </Link>
                </SidebarHeader> */}

                {!isMobile && <NavMain />}

                <div className="ml-auto">
                    <NavUser />
                </div>

            </div>

            {isMobile && (
                <SidebarContent className="text-white">
                    <NavMain />
                </SidebarContent>
            )}


            {/* <SidebarFooter className="lg:flex-row lg:items-center">

            </SidebarFooter> */}
        </Sidebar>
    );
}
