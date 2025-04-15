import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ColumnConfig, TableItem } from '@/types/table';

interface UseDataTableProps {
  open: boolean;
  table: string;
  field: string;
}

export function useDataTable({ open, table, field }: UseDataTableProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [data, setData] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchColumns = async () => {
      try {
        const response = await axios.post(
          route('traerEncabezadoConsultas'),
          { renglon: field },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const resultado = response.data[0].original;
        if (!Array.isArray(resultado)) throw new Error('La respuesta de columnas no es válida');
        setColumns(resultado);
      } catch (error) {
        console.error('Error al cargar columnas:', error);
      }
    };

    fetchColumns();
  }, [open, field]);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          route('traerEntidades'),
          { renglon: table, filtro: '', entidad: '' },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const resultado = response.data[0].original;
        if (!Array.isArray(resultado)) throw new Error('La respuesta de datos no es válida');
        setData(resultado);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, table]);

  const tableColumns = useMemo<ColumnDef<TableItem>[]>(() => {
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

  return {
    data,
    loading,
    tableColumns,
  };
}
