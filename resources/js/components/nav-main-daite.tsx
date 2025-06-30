import { Link, usePage } from '@inertiajs/react';
import { memo } from 'react';

import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroupContent } from '@/components/ui/sidebar';
import { type sidebarItem } from '@/types';

// Use memo to prevent unnecessary re-renders
export const NavMain = memo(function NavMain() {
    const page = usePage();
    const sidebarItems = usePage().props.sidebarItems as sidebarItem[] || [];

    // Group items by tipo_programa
    const groupedItems = sidebarItems.reduce((acc, item) => {
        const tipo = item.tipo_programa;
        if (!acc[tipo]) {
            acc[tipo] = [];
        }
        acc[tipo].push(item);
        return acc;
    }, {} as Record<string, sidebarItem[]>);

    // Sort groups by tipo for consistent order
    const sortedGroups = Object.entries(groupedItems).sort(([tipoA], [tipoB]) => tipoA.localeCompare(tipoB));

    return (
        <>
            {sortedGroups.map(([tipo, items]) => (
                <Collapsible key={tipo} className="group/collapsible">
                    <SidebarGroup>
                        <CollapsibleTrigger asChild>
                            <SidebarGroupLabel>
                                {tipo === 'R' && 'Registros'}
                                {tipo === 'P' && 'Procesos'}
                                {tipo === 'A' && 'Administración'}
                                {tipo === 'C' && 'Reportes'}
                            </SidebarGroupLabel>
                        </CollapsibleTrigger>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.id_programa}>
                                        <SidebarMenuButton asChild isActive={`/${item.programa}` === page.url}>
                                            <Link href={`/${item.programa}`}>
                                                {item.descripcion}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </Collapsible>
            ))}
        </>
    );
});
