import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, FileText, BarChart } from "lucide-react";

interface NavSection {
    title: string;
    items: {
        title: string;
        href: string;
        isNew?: boolean;
        isFavorite?: boolean;
    }[];
}

const navSections: NavSection[] = [
    {
        title: "Recientes",
        items: [
            { title: "Empleados", href: "/empleados" },
            { title: "Cuentas Contables", href: "/cuentas-contables" },
            { title: "Clientes", href: "/clientes" },
            { title: "Configuraciones", href: "/configuraciones" },
            { title: "Tipos de Documentos", href: "/tipos-documentos" },
        ]
    },
    {
        title: "Financieros",
        items: [
            { title: "Especialidades", href: "/especialidades" },
            { title: "Cajeros", href: "/cajeros" },
            { title: "Certificados", href: "/certificados" },
            { title: "Clientes", href: "/clientes", isFavorite: true },
            { title: "Cobradores", href: "/cobradores" },
            { title: "Colores", href: "/colores" },
            { title: "Cuentas", href: "/cuentas" },
            { title: "Formas de Pagos", href: "/formas-pagos" },
        ]
    },
    {
        title: "Contabilidad",
        items: [
            { title: "Activos", href: "/activos" },
            { title: "Áreas", href: "/areas" },
            { title: "Artículos", href: "/articulos" },
            { title: "Bancos", href: "/bancos", isFavorite: true },
            { title: "Categorías", href: "/categorias" },
        ]
    },
    {
        title: "Nómina",
        items: [
            { title: "AFP", href: "/afp" },
            { title: "Conceptos", href: "/conceptos" },
            { title: "Conceptos Fijos", href: "/conceptos-fijos" },
            { title: "Departamentos", href: "/departamentos" },
            { title: "Empleados", href: "/empleados", isFavorite: true, isNew: true },
        ]
    },
    {
        title: "Administración",
        items: [
            { title: "Prueba", href: "/prueba" },
            { title: "Actividades", href: "/actividades" },
            { title: "Comentarios", href: "/comentarios" },
            { title: "Configuraciones", href: "/configuraciones" },
            { title: "Distritos", href: "/distritos" },
        ]
    }
];

export function NavMain() {
    const page = usePage();
    const isMobile = useIsMobile();

    if (!isMobile) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                    <Home className="h-4 w-4" />
                    <span>Inicio</span>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-white hover:bg-blue-600">
                            <span>Registros</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[1000px] bg-white p-4 text-gray-900">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar en registros..."
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {navSections.map((section) => (
                                <div key={section.title} className="space-y-2">
                                    <h3 className="text-sm font-medium text-blue-600">{section.title}</h3>
                                    <div className="space-y-1">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                prefetch
                                                className={cn(
                                                    "flex items-center justify-between rounded-md px-2 py-1.5 text-sm",
                                                    item.href === page.url && "bg-accent",
                                                    "hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <span>{item.title}</span>
                                                <div className="flex items-center gap-1">
                                                    {item.isFavorite && <span className="text-yellow-400">★</span>}
                                                    {item.isNew && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-600">Nuevo</span>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link
                    href="/procesos"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                    <FileText className="h-4 w-4" />
                    <span>Procesos</span>
                </Link>

                <Link
                    href="/reportes"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                    <BarChart className="h-4 w-4" />
                    <span>Reportes</span>
                </Link>
            </div>
        );
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Registros</SidebarGroupLabel>
            <SidebarMenu>
                {navSections.flatMap(section => section.items).map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={item.href === page.url}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch className="text-white">
                                <span>{item.title}</span>
                                {item.isFavorite && <span className="text-yellow-400">★</span>}
                                {item.isNew && <span className="text-xs text-blue-600">Nuevo</span>}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
