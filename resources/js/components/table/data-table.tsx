// src/components/modal/TablaDatos.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender, ColumnDef ,getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { TableItem } from '@/types/table';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: TableItem[];
  columns: ColumnDef<TableItem>[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedItem: TableItem | null;
  onRowClick: (item: TableItem) => void;
  onDoubleClick: (item: TableItem) => void;
}

export const DataTable = React.memo(({
  data,
  columns,
  searchTerm,
  setSearchTerm,
  selectedItem,
  onRowClick,
  onDoubleClick,
}: DataTableProps) => {
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchTerm,
    },
    onGlobalFilterChange: setSearchTerm,
  });

  const { getHeaderGroups, getRowModel } = tableInstance;

  return (
    <>
      <div className="relative flex-1 rounded-md border border-gray-200 shadow-sm h-[450px]">
        <div className="absolute inset-0 overflow-auto">
          <Table className="relative w-full border-collapse table-auto">
            <TableHeader className="sticky top-0 z-10">
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-3 border-r border-blue-700 bg-[#0066b3] px-2 py-1 text-left text-xs font-semibold text-white last:border-r-0"
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
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-10 text-center text-xs text-gray-500">
                    <span className="text-xs">No se encontraron resultados</span>
                  </TableCell>
                </TableRow>
              ) : (
                getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "cursor-pointer border-b border-gray-200 px-2 py-1 text-xs hover:bg-indigo-600",
                      selectedItem === row.original
                        ? "bg-blue-100"
                        : index % 2 === 0
                          ? "bg-white"
                          : "bg-[#f0f7ff]"
                    )}
                    onClick={() => onRowClick(row.original)}
                    onDoubleClick={() => onDoubleClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="truncate border-r border-gray-200 px-2 py-1 last:border-r-0"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Total de registros: {getRowModel().rows.length}
      </div>
    </>
  );
});
