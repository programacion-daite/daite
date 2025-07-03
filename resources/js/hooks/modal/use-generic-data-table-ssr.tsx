import { ColDef, GridOptions } from 'ag-grid-community';
import { useMemo } from 'react';

import { RenderEditButton } from '@/components/table/utils/shared-table-utils';
import { getValueFormatterByType } from '@/lib/utils';
import { DataType, TableButton, TableColumn, TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';

interface UseGenericTableProps {
    columns?: TableColumn[];
    data?: TableItem[];
    primaryId?: string;
}

interface UseAgGridDataReturn {
    columnDefs?: ColDef<TableColumn>[];           // Definiciones de columnas
    rowData?: TableItem[];           // Datos de las filas
    gridOptions?: GridOptions;       // Opciones de configuración de AG-Grid
    loading?: boolean;               // Estado de carga
    error?: string | null;           // Mensaje de error si existe
    defaultColDef?: Partial<ColDef<TableColumn>>;  // Configuración por defecto de columnas
    refreshData?: () => Promise<void>;           // Función para recargar datos
    refreshColumns?: () => Promise<void>;        // Función para recargar columnas
    loadData?: (filters?: Record<string, string>) => Promise<void>;  // Función para cargar datos con filtros
}


const SUMA_MODO = {
    CONTAR_FILAS: 'filas',   // Contar número de filas
    NO_SUMAR: '0',          // No realizar suma
    SUMAR: '1'             // Sumar valores numéricos
} as const;

type SumaModoType = typeof SUMA_MODO[keyof typeof SUMA_MODO];

export function useGenericTableSSR({
    columns,
    data,
    primaryId
}: UseGenericTableProps): UseAgGridDataReturn {

    /**
     * Generates column definitions for the table
     * Includes:
     * - Data columns based on configuration
     * - Action column for row operations
     */
    const columnDefs = useMemo<ColDef<TableColumn>[]>(() => {
        if (!columns) return [];

        const colDefs: ColDef<TableColumn>[] = columns.map((col: TableColumn) => {
            const formatter = getValueFormatterByType(col.tipo as DataType);
            return {
                cellStyle: {
                    fontWeight: 'bold',
                    textAlign: col.alineacion
                },
                context: {
                    sumar: col.sumar,
                },
                field: col.columna || '',
                flex: 1,
                headerName: col.titulo || '',
                valueFormatter: formatter,
                wrapText: true,
            } as ColDef<TableColumn>;
        });

        colDefs.push({
            cellRenderer: RenderEditButton,
            cellStyle: { fontWeight: 'bold', textAlign: 'center' },
            field: 'acciones',
            headerName: '',
            pinned: 'right',
            width: 100
        } as TableButton);

        return colDefs;
    }, [columns]);

    /**
     * Default configuration applied to all columns
     * Sets up basic interactivity and display options
     */
    const defaultColDef = useMemo<Partial<ColDef<TableItem>>>(
        () => ({
            filter: true,
            filterParams: {
                suppressAndOrCondition: true, // Simpler filter UI
            },
            resizable: true,
            sortable: true,
            suppressAutoSize: true,       // Prevent auto-sizing calculations
            // Performance optimizations for columns
            suppressSizeToFit: true,      // Prevent auto-sizing calculations
            wrapHeaderText: true,
        }),
        [],
    );

    /**
     * AG-Grid global configuration options
     * Sets up the core functionality and behavior of the grid
     */
    const gridOptions = useMemo<GridOptions<TableItem>>(
        () => ({
            animateRows: false,               // Disable row animations for better performance
            cacheBlockSize: 100,
            columnDefs,
            columnSize: 'autoSize',
            columnSizeOptions: { skipHeader: true },
            defaultColDef,
            enableCellTextSelection: false,   // Disable text selection for better performance
            getRowId: (params) => params.data[primaryId as keyof TableItem]?.toString() ?? '',
            localeText: TABLE_LANGUAGE_ES,
            rowBuffer: 10,                    // Number of rows rendered outside viewport
            rowData: data,
            rowModelType: 'clientSide',
            rowSelection: 'single',
            suppressCellFocus: true,
            suppressColumnVirtualization: false, // Enable column virtualization
            suppressMovableColumns: true,     // Disable column moving for better performance
        }),
        [columnDefs, data, defaultColDef],
    );

    return {
        columnDefs,
        // defaultColDef,
        // error,
        gridOptions,
        // loadData,
        // loading,
        // refreshColumns,
        // refreshData,
        rowData: data || [],
        loading: false,
        error: null,
        // defaultColDef,
        refreshData: () => Promise.resolve(),
        refreshColumns: () => Promise.resolve(),
        loadData: () => Promise.resolve(),
    };
}
