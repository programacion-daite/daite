import { getValueFormatterByType } from '@/lib/utils';
import { ColumnConfig, DataType, TableItem, UseAgGridDataProps, UseAgGridDataReturn } from '@/types/table.d';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { ColDef, GridOptions } from 'ag-grid-community';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useAgGridData({
    columnsRoute,
    dataRoute,
    fetchData,
    loadColumns,
    parametrosColumna = {},
    parametrosDatos = {},
}: UseAgGridDataProps): UseAgGridDataReturn {
    const [columns, setColumns] = useState<ColumnConfig[]>([]);
    const [rowData, setRowData] = useState<TableItem[]>([]);
    const [loading, setLoading] = useState(false);

    const memoizedColumnsParams = useMemo(() => parametrosColumna, [parametrosColumna]);
    const memoizedDataParams = useMemo(() => parametrosDatos, [parametrosDatos]);

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
            cellStyle: {
                textAlign: col.alineacion as 'left' | 'right' | 'center',
                fontWeight: 'bold',
                textAlign: col.alineacion === 'derecha' ? 'right' : col.alineacion === 'izquierda' ? 'left' : 'center',
            },
            context: {
                sumar: col.sumar,
            },
            valueFormatter: getValueFormatterByType(col.tipo as DataType),
            wrapText: true,
        }));
    }, [columns]);

    // Default column definitions
    const defaultColDef = useMemo<Partial<ColDef<TableItem>>>(
        () => ({
            filter: true,
            resizable: true,
            sortable: true,
            wrapHeaderText: true,
        }),
        [],
    );

    // Grid options
    const gridOptions = useMemo<GridOptions<TableItem>>(
        () => ({
            animateRows: true,
            columnDefs,
            columnSize: 'autoSize',
            columnSizeOptions: { skipHeader: true },
            defaultColDef,
            localeText: TABLE_LANGUAGE_ES,
            rowData,
            rowSelection: 'single',
            suppressCellFocus: true,
        }),
        [columnDefs, rowData, defaultColDef],
    );

    return {
        columnDefs,
        defaultColDef,
        gridOptions,
        loading,
        refreshColumns,
        refreshData,
        rowData,
    };
}
