import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ColumnConfig, TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { numericFormat } from '@/lib/utils';
import { ValueFormatterParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface UseAgGridDataProps {
  loadColumns: boolean;
  fetchData: boolean;
  columnsRoute: string;
  dataRoute: string;
  parametrosColumna?: Record<string, unknown>;
  parametrosDatos?: Record<string, unknown>;
  isGeneric?: boolean;
  shouldRefresh?: boolean;
}

type TipoDato = 'int' | 'numeric' | 'datetime' | 'date' | 'string';

interface UseAgGridDataReturn {
  rowData: TableItem[];
  columnDefs: ColDef<TableItem>[];
  defaultColDef: Partial<ColDef<TableItem>>;
  loading: boolean;
  gridOptions: GridOptions<TableItem>;
  refreshData: () => Promise<void>;
  refreshColumns: () => Promise<void>;
}

const renderEditButton = (params: any) => (
  <Button
    variant="link"
    className="text-blue-500"
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log('Edit button clicked for row:', params.data);
    }}
    data-id={params.data.id_provincia}
  >
    <Pencil className="w-4 h-4 text-green-600" />
  </Button>
);

const getValueFormatterByType = <TData = unknown, TValue = unknown>(
    tipo: TipoDato
  ): ((params: ValueFormatterParams<TData, TValue>) => string | number) | undefined => {
    switch (tipo) {
      case 'int':
        return (params) => parseInt(params.value as string).toString();
      case 'numeric':
        return (params) => numericFormat(params.value as number | string, 2);
      case 'datetime':
        return (params) => {
          if (!params.value) return '';
          return new Date(params.value as string | number | Date).toLocaleDateString();
        };
      case 'date':
        return (params) => {
          if (!params.value) return '';
          return new Date(params.value as string | number | Date)
            .toLocaleDateString('en-GB')
            .replaceAll('.', '/');
        };
      case 'string':
      default:
        return undefined;
    }
  };

export function useAgGridData({
  loadColumns,
  columnsRoute,
  fetchData,
  dataRoute,
  parametrosColumna = {},
  parametrosDatos = {},
  isGeneric = false,
}: UseAgGridDataProps): UseAgGridDataReturn {
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [rowData, setRowData] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize parameters to prevent unnecessary re-renders
  const memoizedColumnsParams = useMemo(() => parametrosColumna, [JSON.stringify(parametrosColumna)]);
  const memoizedDataParams = useMemo(() => parametrosDatos, [JSON.stringify(parametrosDatos)]);

  // Fetch columns data
  const fetchColumns = useCallback(async () => {
    if (!columnsRoute) return;

    try {
      const response = await axios.post(
        route(columnsRoute),
        memoizedColumnsParams,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const resultado = response.data[0].original ?? response.data[0];
      if (!Array.isArray(resultado)) throw new Error('La respuesta de columnas no es válida');
      setColumns(resultado);
    } catch (error) {
      console.error('Error al cargar columnas:', error);
      throw error;
    }
  }, [columnsRoute, memoizedColumnsParams]);

  // Fetch table data
  const fetchTableData = useCallback(async () => {
    if (!dataRoute) return;

    setLoading(true);
    try {
      const response = await axios.post(
        route(dataRoute),
        memoizedDataParams,
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
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dataRoute, memoizedDataParams]);

  // Public refresh methods
  const refreshData = useCallback(async () => {
    await fetchTableData();
  }, [fetchTableData]);

  const refreshColumns = useCallback(async () => {
    await fetchColumns();
  }, [fetchColumns]);

  // Initial data loading
  useEffect(() => {
    if (loadColumns) {
      fetchColumns().catch(console.error);
    }
  }, [loadColumns, fetchColumns]);

  useEffect(() => {
    if (fetchData) {
      fetchTableData().catch(console.error);
    }
  }, [fetchData, fetchTableData]);

  // Generate column definitions
  const columnDefs = useMemo<ColDef<TableItem>[]>(() => {
    const baseColumns = isGeneric
      ? columns.filter(col => isGeneric || col.visible === '1')
      : columns.filter(col => col.visible === '1');

    const mappedColumns = baseColumns.map(col => ({
      field: isGeneric ? col.nombre : col.columna,
      headerName: isGeneric ? col.nombre.replace('_', ' ') : col.titulo,
      headerClass: isGeneric ? 'capitalize' : undefined,
      wrapText: true,
      flex: 1,
      cellStyle: {
        textAlign: col.alineacion === 'derecha' ? 'right'
                : col.alineacion === 'izquierda' ? 'left'
                : isGeneric ? 'left' : 'center',
        fontWeight: 'bold',
      },
      context: {
        sumar: isGeneric ? (col.sumar ?? col.nombre === 'id_provincia' ? 'filas' : '0') : col.sumar,
      },
      valueFormatter: getValueFormatterByType(col.tipo),
    }));

    if (isGeneric) {
      return [
        ...mappedColumns,
        {
          field: 'acciones',
          headerName: '',
          width: 100,
          pinned: 'right',
          cellRenderer: renderEditButton,
          cellStyle: { textAlign: 'center' },
          suppressExport: true,
        }
      ];
    }
    return mappedColumns;
  }, [columns, isGeneric]);

  // Default column definitions
  const defaultColDef = useMemo<Partial<ColDef<TableItem>>>(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    wrapHeaderText: true,
  }), []);

  // Grid options
  const gridOptions = useMemo<GridOptions<TableItem>>(() => ({
    localeText: TABLE_LANGUAGE_ES,
    columnDefs,
    rowData,
    defaultColDef,
    animateRows: true,
    suppressCellFocus: true,
    rowSelection: 'single',
    columnSize: "autoSize",
    columnSizeOptions: { "skipHeader": true },
  }), [columnDefs, rowData, defaultColDef]);

  return {
    rowData,
    columnDefs,
    defaultColDef,
    loading,
    gridOptions,
    refreshData,
    refreshColumns,
  };
}
