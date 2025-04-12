import { AppSidebar } from "@/components/app-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <div className="bg-blue-700">
                <AppSidebar />
            </div>
            <main className="flex-1 bg-white">
                {children}
            </main>
        </div>
    );
}
