import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ColDef, GridOptions, GridReadyEvent, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ColumnConfig, TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { numericFormat } from '@/lib/utils';

interface UseAgGridDataProps {
  open: boolean;
  columnsRoute: string;
  dataRoute: string;
  parametrosColumna?: Record<string, unknown>;
  parametrosDatos?: Record<string, unknown>;
}

export function useAgGridData({
  open,
  columnsRoute,
  dataRoute,
  parametrosColumna,
  parametrosDatos,
}: UseAgGridDataProps) {
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [rowData, setRowData] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const localeText = useMemo(() => TABLE_LANGUAGE_ES, []);

  // Usamos JSON.stringify para evitar el problema del bucle infinito
  const memoizedColumnsParams = useMemo(() => parametrosColumna, [JSON.stringify(parametrosColumna)]);
  const memoizedDataParams = useMemo(() => parametrosDatos, [JSON.stringify(parametrosDatos)]);

  useEffect(() => {
    if (!open || !columnsRoute) return;

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
  }, [open, columnsRoute, memoizedColumnsParams]);

  useEffect(() => {
    if (!open || !dataRoute) return;

    const fetchData = async () => {
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

    fetchData();
  }, [open, dataRoute, memoizedDataParams]);

  function getValueFormatterByType(tipo: string): ((params: any) => string | number) | undefined {
    switch (tipo) {
      case 'int':
        return (params) => {
            const val = parseInt(params.value).toString();
            return val;
        }
        break

      case 'numeric':
        return (params) => {
          const val = numericFormat(params.value, 2);
          return val;
        };

      case 'datetime':
        return (params) => {
          if (!params.value) return '';
          const date = new Date(params.value);
          return date.toLocaleDateString(); // solo fecha
        };

      case 'date':
        return (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString('en-GB').replaceAll('.', '/');
        };

      default:
        return undefined; // Sin formateo
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
