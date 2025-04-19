import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ColumnConfig, TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { numericFormat } from '@/lib/utils';
import { ValueFormatterParams } from 'ag-grid-community';

interface UseAgGridDataProps {
  loadColumns: boolean;
  fetchData: boolean;
  columnsRoute: string;
  dataRoute: string;
  parametrosColumna?: Record<string, unknown>;
  parametrosDatos?: Record<string, unknown>;
}

type TipoDato = 'int' | 'numeric' | 'datetime' | 'date' | 'string';

export function useAgGridData({
  loadColumns,
  columnsRoute,
  fetchData,
  dataRoute,
  parametrosColumna,
  parametrosDatos,
}: UseAgGridDataProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [rowData, setRowData] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const localeText = useMemo(() => TABLE_LANGUAGE_ES, []);

  const memoizedColumnsParams = useMemo(() => parametrosColumna, [JSON.stringify(parametrosColumna)]);
  const memoizedDataParams = useMemo(() => parametrosDatos, [JSON.stringify(parametrosDatos)]);

  useEffect(() => {
    if (!loadColumns || !columnsRoute) return;

    const fetchColumns = async () => {
      try {
        const response = await axios.post(
          route(columnsRoute),
          memoizedColumnsParams ?? {},
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        const resultado = response.data[0].original;
        if (!Array.isArray(resultado)) throw new Error('La respuesta de columnas no es válida');
        setColumns(resultado);
      } catch (error) {
        console.error('Error al cargar columnas:', error);
      }
    };

    fetchColumns();
  }, [loadColumns, columnsRoute, memoizedColumnsParams]);

  useEffect(() => {
    if (!fetchData || !dataRoute) return;

    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          route(dataRoute),
          memoizedDataParams ?? {},
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        const resultado = response.data[0].original;
        if (!Array.isArray(resultado)) throw new Error('La respuesta de datos no es válida');
        setRowData(resultado);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [fetchData, dataRoute, memoizedDataParams]);

  function getValueFormatterByType<TData = unknown, TValue = unknown>(
    tipo: TipoDato
  ): ((params: ValueFormatterParams<TData, TValue>) => string | number) | undefined {
    switch (tipo) {
      case 'int':
        return (params: ValueFormatterParams<TData, TValue>) => {
          const val = parseInt(params.value as string).toString();
          return val;
        };

      case 'numeric':
        return (params: ValueFormatterParams<TData, TValue>) => {
          const val = numericFormat(params.value as number | string, 2);
          return val;
        };

      case 'datetime':
        return (params: ValueFormatterParams<TData, TValue>) => {
          if (!params.value) return '';
          const date = new Date(params.value as string | number | Date);
          return date.toLocaleDateString();
        };

      case 'date':
        return (params: ValueFormatterParams<TData, TValue>) => {
          if (!params.value) return '';
          return new Date(params.value as string | number | Date)
            .toLocaleDateString('en-GB')
            .replaceAll('.', '/');
        };

      default:
        return undefined;
    }
  }

  const columnDefs = useMemo<ColDef<TableItem>[]>(() => {
    return columns
      .filter((col) => col.visible === '1')
      .map((col) => ({
        field: col.columna,
        headerName: col.titulo,
        wrapText: true,
        // autoHeight: 15,
        flex: 1,
        // width: col.ancho ? parseInt(col.ancho) : 130,
        cellStyle: {
          textAlign: col.alineacion === 'derecha' ? 'right' : col.alineacion === 'izquierda' ? 'left' : 'center',
          fontWeight: 'bold',
        //   fontWeight: col.negrita === '1' ? 'bold' : 'normal',
        //   fontSize: '11px',
        //   lineHeight: '1.1',
        },
        context:{
            sumar: col.sumar
        },
        valueFormatter: getValueFormatterByType(col.tipo)
      }));
  }, [columns]);

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      sortable: true,
      filter: true,
      wrapHeaderText: true,
    };
  }, []);

  const gridOptions = useMemo<GridOptions<TableItem>>(() => ({
    localeText: localeText,
    columnDefs,
    rowData,
    defaultColDef,
    animateRows: true,
    suppressCellFocus: true,
    rowSelection: 'single',
    columnSize:"autoSize",
    columnSizeOptions:{"skipHeader": true},
    // headerHeight: 30,
    // rowHeight: 24,
  }), [columnDefs, rowData, defaultColDef, localeText]);

  return {
    rowData,
    columnDefs,
    defaultColDef,
    loading,
    gridOptions
  };
}
