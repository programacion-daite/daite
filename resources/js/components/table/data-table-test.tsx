// src/components/modal/TablaDatos.tsx
import React, { useRef } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, ColumnDef } from '@tanstack/react-table';
import { TableItem } from '@/types/table';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';

interface DataTableProps {
  data: TableItem[];
  columns: ColumnDef<TableItem>[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedItem: TableItem | null;
  onRowClick: (item: TableItem) => void;
  onDoubleClick: (item: TableItem) => void;
}

export function DataTable({
  data,
  columns,
  searchTerm,
  setSearchTerm,
  selectedItem,
  onRowClick,
  onDoubleClick,
}: DataTableProps) {
  // Configuramos react-table
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter: searchTerm },
    onGlobalFilterChange: setSearchTerm,
  });

  const headerGroups = tableInstance.getHeaderGroups();
  const rows = tableInstance.getRowModel().rows;

  // Referencia para el contenedor del cuerpo de la tabla.
  const parentRef = useRef<HTMLTableSectionElement>(null);

  // Configuración del virtualizer
  const rowHeight = 40; // Altura fija de cada fila (ajústala según convenga)
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <>
      <div className="relative flex-1 rounded-md border border-gray-200 shadow-sm h-[450px]">
        <div className="absolute inset-0 overflow-auto">
          <Table className="relative w-full border-collapse table-auto">
            {/* Encabezado */}
            <TableHeader className="sticky top-0 z-10">
              {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-3 border-r border-blue-700 bg-[#0066b3] px-2 py-1 text-left text-xs font-semibold text-white last:border-r-0"
                      style={{ width: header.column.columnDef.meta?.width || 'auto' }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Cuerpo de la tabla con virtualización */}
            <tbody ref={parentRef} style={{ position: 'relative', height: totalSize }}>
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className={cn(
                      "cursor-pointer border-b border-gray-200 px-2 py-1 text-xs hover:bg-blue-50",
                      selectedItem === row.original
                        ? "bg-blue-100"
                        : virtualRow.index % 2 === 0
                          ? "bg-white"
                          : "bg-[#f0f7ff]"
                    )}
                    onClick={() => onRowClick(row.original)}
                    onDoubleClick={() => onDoubleClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="truncate border-r border-gray-200 px-2 py-1 last:border-r-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Total de registros: {rows.length}
      </div>
    </>
  );
}
