// hooks/useTableColumns.ts
import { useMemo } from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ColumnConfig, TableItem } from '@/types/table';

export function useTableColumns(columns: ColumnConfig[]) {
  return useMemo<ColumnDef<TableItem>[]>(() => {
    return columns
      .filter((col) => col.visible === '1')
      .map((col) => ({
        accessorKey: col.columna,
        header: col.titulo,
        meta: {
          width: col.ancho || 'auto',
        },
        cell: ({ row }: { row: Row<TableItem> }) => {
          const value = row.getValue(col.columna);
          return (
            <div
              style={{
                textAlign: col.alineacion as 'left' | 'center' | 'right',
                fontWeight: col.negrita === '1' ? 'bold' : 'normal',
                fontSize: '11px',
                lineHeight: '1.2',
              }}
            >
              {value as React.ReactNode}
            </div>
          );
        },
      }));
  }, [columns]);
}
