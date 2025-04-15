// hooks/useTableQuery.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ColumnConfig, TableItem } from '@/types/table';
import { useTableColumns } from '../columns/use-table-columns';

interface UseTableQueryProps {
  table: string;
  field: string;
  open: boolean; // recibe si el modal está abierto para evitar llamadas innecesarias
}

export function useTableQuery({ table, field, open }: UseTableQueryProps) {
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
        const result = response.data[0].original;
        if (!Array.isArray(result)) throw new Error('Columnas inválidas');
        setColumns(result);
      } catch (error) {
        console.error('Error cargando columnas:', error);
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
        const result = response.data[0].original;
        if (!Array.isArray(result)) throw new Error('Datos inválidos');
        setData(result);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, table]);

  const tableColumns = useTableColumns(columns);

  return { columns, data, loading, tableColumns };
}
