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

// Tipos para la configuración de columnas
interface ColumnConfig {
    nombre?: string;
    tipo: string;
    sumar?: string;
}

// Constantes para modos de suma
const SUMA_MODO = {
    NO_SUMAR: '0',
    SUMAR: '1',
    CONTAR_FILAS: 'filas'
} as const;

type SumaModoType = typeof SUMA_MODO[keyof typeof SUMA_MODO];

/**
 * Hook para crear una tabla genérica utilizando AG-Grid
 * @param tableName - Nombre de la tabla a mostrar
 * @param primaryId - Campo que actúa como identificador primario
 * @returns Configuración y datos necesarios para AG-Grid
 */
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

    const createColumnDefinition = (col: ColumnConfig): ColDef<TableItem> => {
        const esCampoId = col.nombre?.startsWith('id_') && col.nombre !== primaryId;
        const esIdPrimario = col.nombre === primaryId;
        const displayField = esCampoId ? col.nombre?.replace('id_', '') : col.nombre;

        let sumarModo: SumaModoType = SUMA_MODO.NO_SUMAR;
        if (esIdPrimario) {
            sumarModo = SUMA_MODO.CONTAR_FILAS;
        } else if (col.tipo === 'numeric' && col.sumar === '1') {
            sumarModo = SUMA_MODO.SUMAR;
        }

        const colDef: ColDef<TableItem> = {
            field: displayField ?? '',
            headerName: (displayField ?? '').replace(/_/g, ' '),
            headerClass: 'capitalize',
            cellStyle: {
                textAlign: col.tipo === 'numeric' ? 'right' : 'left',
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

        if (esIdPrimario) {
            colDef.sort = 'desc' as SortDirection;
            colDef.sortIndex = 0;
            colDef.comparator = (valueA, valueB) => {
                const numA = Number(valueA);
                const numB = Number(valueB);
                return numA - numB;
            };
        }

        if (esCampoId) {
            colDef.headerName = (displayField ?? '').replace(/_/g, ' ');
        }

        return colDef;
    };

    const columnDefs = useMemo<ColDef<TableItem>[]>(() => {
        if (!columnsData?.columns.length) return [];

        const colDefs: ColDef<TableItem>[] = columnsData.columns.map(createColumnDefinition);

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
