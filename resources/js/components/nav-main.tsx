import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Home, FileText, BarChart, ChevronDown, CreditCard } from "lucide-react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SessionData, Modulo, Programa } from '@/types';

type MenuConfig = {
    title: string;
    icon: React.ElementType;
    key: ProgramType;
}

type ProgramType = 'registros' | 'procesos' | 'reportes' | 'favoritos' | 'genericos';

const MENU_CONFIG: MenuConfig[] = [
    { title: 'Registros', icon: FileText, key: 'registros' },
    { title: 'Procesos', icon: FileText, key: 'procesos' },
    { title: 'Reportes', icon: BarChart, key: 'reportes' },
];

export function NavMain() {
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const page = usePage();
    const isMobile = useIsMobile();

    useEffect(() => {
        axios.get(route('traerDatosSesion'))
            .then((response) => {
                if (response.status !== 200 || !response.data) {
                    throw new Error("Error fetching session data");
                }
                setSessionData(response.data);
            })
            .catch((error: Error) => console.error('Error fetching session data:', error));
    }, []);

    if (!sessionData) return <div>Cargando...</div>;
    if (isMobile) return null;

    return (
        <div className="flex items-center">
            <Link
                href="/dashboard"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold text-white hover:bg-blue-600"
            >
                <Home className="h-4 w-4" />
                <span>Inicio</span>
            </Link>

            {MENU_CONFIG.map(({ title, icon: Icon, key }) => (
                <DropdownMenu key={key}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-white gap-1 font-bold hover:bg-blue-600">
                            <Icon className="h-4 w-4" />
                            <span>{title}</span>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-[1000px] bg-white p-1 text-gray-900 overflow-y-auto max-h-[90vh] [&>*]:text-sm"
                    >
                        <div className="grid grid-cols-4">
                            {sessionData.modulos?.map((modulo: Modulo, idx) => (
                                <div key={idx} className="space-y-2 border-r border-b">
                                    <div className="p-2 bg-tertiary border-b flex items-center gap-1.5">
                                        <CreditCard className="h-3.5 w-3.5 text-blue-700" />
                                        <h3 className="text-md font-sm text-white">{modulo.modulo}</h3>
                                    </div>
                                    <div className="p-1.5">
                                        {sessionData.programas[key]?.[modulo.id_modulo]?.map((programa: Programa, index: number) =>
                                            programa.visible && (
                                                <Link
                                                    key={index}
                                                    href="#"
                                                    data-programa-id={programa.id_programa}
                                                    {...(programa.favorito ? { 'data-programa-favorito': '' } : {})}
                                                    className={cn(
                                                        "flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-gray-700 font-bold",
                                                        page.url === '#' ? 'active' : '',
                                                        "hover:bg-accent hover:text-white"
                                                    )}
                                                >
                                                    {programa.descripcion}
                                                </Link>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            ))}
        </div>
    );
}
