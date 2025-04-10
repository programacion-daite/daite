import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModalBusqueda } from '@/hooks/modal/use-modal-busqueda';
import { ModalBusquedaProps, TableItem } from '@/types/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ModalBusqueda({ title, table, field, onSelect }: ModalBusquedaProps) {
    const { searchTerm, setSearchTerm, open, setOpen, selectedItem, setSelectedItem, data, loading, tableColumns } = useModalBusqueda({
        table,
        field,
    });

    const tableInstance = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: searchTerm,
        },
        onGlobalFilterChange: setSearchTerm,
    });

    const handleSelect = () => {
        if (selectedItem) {
            onSelect(selectedItem);
            setOpen(false);
            setSelectedItem(null);
        }
    };

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
    };

    const handleDoubleRowClick = (item: TableItem) => {
        setSelectedItem(item);
        handleSelect();
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedItem(null);
        setSearchTerm('');
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6 h-9 w-9 shrink-0 rounded-l-none bg-blue-600 text-white hover:bg-blue-800"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4" />
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex h-[550px] w-full max-w-4xl flex-col overflow-hidden rounded-md bg-white shadow-xl">
                        {/* Encabezado */}
                        <div className="flex h-8 items-center justify-between bg-[#0066b3] px-3 py-1 text-white">
                            <h2 className="text-sm font-semibold">{title}</h2>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-white hover:bg-blue-700" onClick={handleCancel}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Contenido */}
                        <div className="flex flex-1 flex-col p-3">
                            <div className="mb-2">
                                <label htmlFor="search" className="mb-1 block text-xs font-medium text-gray-700">
                                    Buscar
                                </label>
                                <div className="flex">
                                    <Input
                                        autoFocus
                                        id="search"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-7 rounded-r-none text-xs focus-visible:ring-blue-500"
                                    />
                                    <Button type="button" className="h-7 rounded-l-none bg-[#0066b3] px-2 hover:bg-[#005091]">
                                        <Search className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="relative flex-1 rounded-md border border-gray-200 shadow-sm">
                                {/* <style>{`
                                    .modal-table {
                                        max-height: 350px;
                                        overflow-y: auto;
                                    }
                                    .modal-table table {
                                        width: 100%;
                                        border-collapse: collapse;
                                    }
                                    .modal-table th {
                                        background-color: #0066b3;
                                        color: white;
                                        font-size: 0.7rem;
                                        font-weight: 600;
                                        height: 22px;
                                        line-height: 1.2;
                                        position: sticky;
                                        top: 0;
                                        z-index: 10;
                                    }
                                    .modal-table td {
                                        font-size: 0.7rem;
                                        height: 22px;
                                        line-height: 1.2;
                                        padding: 2px 4px;
                                    }
                                    .modal-table tr:nth-child(even) {
                                        background-color: #f0f7ff;
                                    }
                                    .modal-table tr.selected {
                                        background-color: #e0f0ff !important;
                                    }
                                    .modal-table tr:hover:not(.selected) {
                                        background-color: #f8f9fa;
                                    }
                                `}</style> */}

                                    <div className="absolute inset-0 overflow-auto">
                                        <Table className='relative w-full border-collapse table-auto'>
                                            <TableHeader className='sticky top-0 z-10'>
                                                {tableInstance.getHeaderGroups().map((headerGroup) => (
                                                    <TableRow key={headerGroup.id}>
                                                        {headerGroup.headers.map((header) => (
                                                            <TableHead
                                                                key={header.id}
                                                                className='h-3 border-r border-blue-700 bg-[#0066b3] px-2 py-1 text-left text-xs font-semibold text-white last:border-r-0'
                                                                style={{
                                                                    width: header.column.columnDef.meta?.width || 'auto',
                                                                }}
                                                                >
                                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                            </TableHead>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={tableColumns.length} className="h-10 text-center text-xs text-gray-500">
                                                            <span className="text-xs">Cargando...</span>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : tableInstance.getRowModel().rows.length > 0 ? (
                                                    tableInstance.getRowModel().rows.map((row, index) => (
                                                        <TableRow
                                                            key={row.id}
                                                            className={cn("cursor-pointer border-b border-gray-200 px-2 py-1 text-xs hover:bg-blue-50",
                                                                selectedItem === row.original
                                                                  ? "bg-blue-100"
                                                                  : index % 2 === 0
                                                                    ? "bg-white"
                                                                    : "bg-[#f0f7ff]")}
                                                            onClick={() => handleRowClick(row.original)}
                                                            onDoubleClick={() => handleDoubleRowClick(row.original)}
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id} className='truncate border-r border-gray-200 px-2 py-1 last:border-r-0'>
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={tableColumns.length} className="h-10 text-center text-xs text-gray-500">
                                                            <span className="text-xs">No se encontraron resultados</span>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                                Total de registros: {tableInstance.getRowModel().rows.length}
                            </div>
                        </div>

                        <div className="flex justify-between border-t border-gray-200 bg-gray-50 p-2">
                            <Button
                                type="button"
                                className="h-7 bg-[#0066b3] px-3 text-xs font-medium shadow-sm hover:bg-[#005091]"
                                onClick={handleSelect}
                                disabled={!selectedItem}
                            >
                                Seleccionar
                            </Button>
                            <Button type="button" variant="outline" className="h-7 border-gray-300 px-3 text-xs font-medium shadow-sm hover:bg-gray-100" onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
