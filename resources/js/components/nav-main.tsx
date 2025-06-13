import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Home, FileText, BarChart, ChevronDown, CreditCard, ChartBar } from "lucide-react";
import { SessionData, Modulo, Programa } from '@/types';
import { useState, useCallback, memo } from 'react';

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

const MenuItem = memo(({
    programa,
    isActive,
    onClose
}: {
    programa: Programa;
    isActive: boolean;
    onClose: () => void;
}) => (
    <Link
        href={route(programa.programa)}
        data-programa-id={programa.id_programa}
        {...(programa.favorito ? { 'data-programa-favorito': '' } : {})}
        className={cn(
            "flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-gray-700 font-bold",
            isActive ? 'active' : '',
            "hover:bg-accent hover:text-white"
        )}
        onClick={onClose}
    >
        {programa.descripcion}
    </Link>
));

const ModuleSection = memo(({
    modulo,
    programas,
    isActive,
    onClose
}: {
    modulo: Modulo;
    programas: Programa[];
    isActive: boolean;
    onClose: () => void;
}) => (
    <div className="space-y-2 border-r border-b">
        <div className="p-2 bg-tertiary border-b flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-blue-700" />
            <h3 className="text-md font-sm text-white">{modulo.modulo}</h3>
        </div>
        <div className="p-1.5">
            {programas.map((programa, index) =>
                programa.visible && (
                    <MenuItem
                        key={index}
                        programa={programa}
                        isActive={isActive}
                        onClose={onClose}
                    />
                )
            )}
        </div>
    </div>
));

export const NavMain = memo(function NavMain() {
    const sessionData = usePage().props.sessionData as SessionData;
    const page = usePage();
    const isMobile = useIsMobile();
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const handleMenuChange = useCallback((key: string | null) => {
        setOpenMenu(key);
    }, []);

    const handleLinkClick = useCallback(() => {
        setOpenMenu(null);
    }, []);

    if (!sessionData) return <div>Cargando...</div>;
    if (isMobile) return null;

    return (
        <div className="flex items-center">
            <Link
                href="/inicio"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold text-white hover:bg-blue-600"
            >
                <Home className="h-4 w-4" />
                <span>Inicio</span>
            </Link>

            {MENU_CONFIG.map(({ title, icon: Icon, key }) => (
                <DropdownMenu
                    key={key}
                    open={openMenu === key}
                    onOpenChange={(open) => handleMenuChange(open ? key : null)}
                >
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-white gap-1 font-bold hover:bg-blue-900 hover:text-white">
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
                                <ModuleSection
                                    key={idx}
                                    modulo={modulo}
                                    programas={sessionData.programas[key]?.[modulo.id_modulo] || []}
                                    isActive={page.url === '#'}
                                    onClose={handleLinkClick}
                                />
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            ))}

            <Button variant="ghost" className="text-white gap-1 font-bold hover:bg-blue-900 hover:text-white">
                <ChartBar className="h-4 w-4" />
                <Link href="/estadisticas">Estadisticas</Link>
            </Button>
        </div>
    );
});
