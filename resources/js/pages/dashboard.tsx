import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Inicio" />

            <div className="bg-[#e6f0f9] p-4 rounded-t-md flex items-center w-full">
                <Button variant="ghost" size="icon" className="bg-blue-600 text-white h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold text-[#0066b3] flex-grow text-center">Inicio</h2>
            </div>

        </>
    );
}
