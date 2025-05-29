import { RenderEditButton } from '@/components/table/utils/shared-table-utils';
import { getValueFormatterByType } from '@/lib/utils';
import { TableItem, TipoDato } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { ColDef, GridOptions, SortDirection, ValueFormatterFunc } from 'ag-grid-community';
import { useCallback, useMemo } from 'react';
import { useTableColumns, useTableData } from '../table/use-table-queries';

interface UseGenericTableProps {
    tableName: string | undefined;
    primaryId: string | undefined;
}

interface UseAgGridDataReturn {
    columnDefs: ColDef[];
    rowData: TableItem[];
    gridOptions: GridOptions;
    loading: boolean;
    error: string | null;
    defaultColDef: Partial<ColDef<TableItem>>;
    refreshData: () => Promise<void>;
    refreshColumns: () => Promise<void>;
    loadData: (filters?: Record<string, string>) => Promise<void>;
}

export function useGenericTable({
    tableName,
    primaryId
}: UseGenericTableProps): UseAgGridDataReturn {
    const {
        data: columnsData,
        isLoading: isLoadingColumns,
        error: columnsError,
        refetch: refetchColumns
    } = useTableColumns(tableName, primaryId);

    const {
        data: rowData = [],
        isLoading: isLoadingData,
        error: dataError,
        refetch: refetchData
    } = useTableData(tableName, primaryId, columnsData?.hasForeignIDs ?? false);

    const loading = isLoadingColumns || isLoadingData;
    const error = columnsError?.message || dataError?.message || null;

    const refreshData = useCallback(async () => {
        await refetchData();
    }, [refetchData]);

    const refreshColumns = useCallback(async () => {
        await refetchColumns();
    }, [refetchColumns]);

    const loadData = useCallback(async () => {
        await refetchData();
    }, [refetchData]);

    const columnDefs = useMemo<ColDef<TableItem>[]>(() => {
        if (!columnsData?.columns.length) return [];

        const colDefs: ColDef<TableItem>[] = [];

        columnsData.columns.forEach((col) => {
            const esCampoId = col.nombre?.startsWith('id_') && col.nombre !== primaryId;
            const esIdPrimario = col.nombre === primaryId;

            const displayField = esCampoId ? col.nombre?.replace('id_', '') : col.nombre;

            let sumarModo = '0';
            if (esIdPrimario) {
                sumarModo = 'filas';
            } else if (col.tipo === 'numeric' && col.sumar === '1') {
                sumarModo = '1';
            }

            const colDef: ColDef<TableItem> = {
                field: displayField ?? '',
                headerName: (displayField ?? '').replace(/_/g, ' '),
                headerClass: 'capitalize',
                cellStyle: {
                    textAlign: 'left',
                    fontWeight: 'bold',
                },
                context: {
                    sumar: sumarModo,
                    isPrimary: esIdPrimario,
                    esForaneo: esCampoId
                },
                valueFormatter: getValueFormatterByType(col.tipo as TipoDato) as ValueFormatterFunc<TableItem>,
                wrapText: true,
                flex: 1,
            };

            colDef.sort = 'desc' as SortDirection;
            colDef.sortIndex = 0;
            colDef.comparator = (valueA, valueB) => {
                const numA = Number(valueA);
                const numB = Number(valueB);
                return numA - numB;
            };

            if (esCampoId) {
                colDef.headerName = (displayField ?? '').replace(/_/g, ' ');
            }

            colDefs.push(colDef);
        });

        colDefs.push({
            field: 'acciones',
            headerName: '',
            width: 100,
            pinned: 'right',
            cellRenderer: RenderEditButton,
            cellStyle: { textAlign: 'center' }
        });

        return colDefs;
    }, [columnsData, primaryId]);

    const defaultColDef = useMemo<Partial<ColDef<TableItem>>>(
        () => ({
            resizable: true,
            sortable: true,
            filter: true,
            wrapHeaderText: true,
        }),
        [],
    );

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
        columnDefs,
        rowData,
        gridOptions,
        loading,
        error,
        defaultColDef,
        refreshData,
        refreshColumns,
        loadData
    };
}
