import { Button } from '@/components/ui/button';
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/inicio',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="bg-[#e6f0f9] p-4 rounded-t-md flex items-center w-full">
                <Button variant="ghost" size="icon" className="bg-blue-600 text-white h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold text-[#0066b3] flex-grow text-center">Inicio</h2>
            </div>

        </AppLayout>
    );
}
