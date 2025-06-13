import { getValueFormatterByType } from '@/lib/utils';
import { ColumnConfig, TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { ColDef, GridOptions } from 'ag-grid-community';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseAgGridDataProps {
    loadColumns: boolean;
    fetchData: boolean;
    columnsRoute: string;
    dataRoute: string;
    parametrosColumna?: Record<string, unknown>;
    parametrosDatos?: Record<string, unknown>;
    isGeneric?: boolean;
    shouldRefresh?: boolean;
    primaryId?: string;
    tableName?: string;
}

interface UseAgGridDataReturn {
    rowData: TableItem[];
    columnDefs: ColDef<TableItem>[];
    defaultColDef: Partial<ColDef<TableItem>>;
    loading: boolean;
    gridOptions: GridOptions<TableItem>;
    refreshData: () => Promise<void>;
    refreshColumns: () => Promise<void>;
}

export function useAgGridData({
    loadColumns,
    columnsRoute,
    fetchData,
    dataRoute,
    parametrosColumna = {},
    parametrosDatos = {},
}: UseAgGridDataProps): UseAgGridDataReturn {
    const [columns, setColumns] = useState<ColumnConfig[]>([]);
    const [rowData, setRowData] = useState<TableItem[]>([]);
    const [loading, setLoading] = useState(false);

    const memoizedColumnsParams = useMemo(() => parametrosColumna, [JSON.stringify(parametrosColumna)]);
    const memoizedDataParams = useMemo(() => parametrosDatos, [JSON.stringify(parametrosDatos)]);

    // Fetch columns
    const fetchColumns = useCallback(async () => {
        if (!columnsRoute) return;

        try {
            const response = await axios.post(route(columnsRoute), memoizedColumnsParams, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            const resultado = response.data;
            if (!Array.isArray(resultado)) throw new Error('Invalid columns response');

            setColumns(resultado.filter((col) => col.visible === '1'));
        } catch (error) {
            console.error('Error fetching columns:', error);
            throw error;
        }
    }, [columnsRoute, memoizedColumnsParams]);

    // Fetch table data
    const fetchTableData = useCallback(async () => {
        if (!dataRoute) return;

        setLoading(true);
        try {
            const response = await axios.post(route(dataRoute), memoizedDataParams, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            const resultado = response.data;
            if (!Array.isArray(resultado)) throw new Error('Invalid data response');
            setRowData(resultado);
        } catch (error) {
            console.error('Error fetching data:', error);
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
        return columns.map((col) => ({
            field: col.columna || '',
            headerName: col.titulo || '',
            cellStyle: {
                textAlign: col.alineacion === 'derecha' ? 'right' : col.alineacion === 'izquierda' ? 'left' : 'center',
                fontWeight: 'bold',
            },
            context: {
                sumar: col.sumar,
            },
            valueFormatter: getValueFormatterByType(col.tipo),
            wrapText: true,
            flex: 1,
        }));
    }, [columns]);

    // Default column definitions
    const defaultColDef = useMemo<Partial<ColDef<TableItem>>>(
        () => ({
            resizable: true,
            sortable: true,
            filter: true,
            wrapHeaderText: true,
        }),
        [],
    );

    // Grid options
    const gridOptions = useMemo<GridOptions<TableItem>>(
        () => ({
            localeText: TABLE_LANGUAGE_ES,
            columnDefs,
            rowData,
            defaultColDef,
            animateRows: true,
            suppressCellFocus: true,
            rowSelection: 'single',
            columnSize: 'autoSize',
            columnSizeOptions: { skipHeader: true },
        }),
        [columnDefs, rowData, defaultColDef],
    );

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
