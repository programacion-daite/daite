import { ColumnDef, Row } from '@tanstack/react-table';
// hooks/useTableColumns.ts
import { useMemo } from 'react';

import { ColumnConfig, TableItem } from '@/types/table';

export function useTableColumns(columns: ColumnConfig[]) {
  return useMemo<ColumnDef<TableItem>[]>(() => {
    return columns
      .filter((col) => col.visible === '1')
      .map((col) => ({
        accessorKey: col.columna,
        cell: ({ row }: { row: Row<TableItem> }) => {
          const value = row.getValue(col.columna);
          return (
            <div
              style={{
                fontSize: '11px',
                fontWeight: col.negrita === '1' ? 'bold' : 'normal',
                lineHeight: '1.2',
                textAlign: col.alineacion as 'left' | 'center' | 'right',
              }}
            >
              {value as React.ReactNode}
            </div>
          );
        },
        header: col.titulo,
        meta: {
          width: col.ancho || 'auto',
        },
      }));
  }, [columns]);
}
