import { RenderEditButton } from '@/components/table/utils/shared-table-utils';
import { getValueFormatterByType } from '@/lib/utils';
import { TableItem, TipoDato } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { ColDef, GridOptions, SortDirection, ValueFormatterFunc } from 'ag-grid-community';
import { useCallback, useMemo } from 'react';
import { useTableColumns, useTableData } from '../table/use-table-queries';

/**
 * Propiedades necesarias para inicializar la tabla genérica
 */
interface UseGenericTableProps {
    tableName: string | undefined;  // Nombre de la tabla a mostrar
    primaryId: string | undefined;  // Identificador único de la tabla
}

/**
 * Interfaz que define la estructura de retorno del hook
 * Contiene toda la configuración necesaria para AG-Grid
 */
interface UseAgGridDataReturn {
    columnDefs: ColDef[];           // Definiciones de columnas
    rowData: TableItem[];           // Datos de las filas
    gridOptions: GridOptions;       // Opciones de configuración de AG-Grid
    loading: boolean;               // Estado de carga
    error: string | null;           // Mensaje de error si existe
    defaultColDef: Partial<ColDef<TableItem>>;  // Configuración por defecto de columnas
    refreshData: () => Promise<void>;           // Función para recargar datos
    refreshColumns: () => Promise<void>;        // Función para recargar columnas
    loadData: (filters?: Record<string, string>) => Promise<void>;  // Función para cargar datos con filtros
}

/**
 * Configuración de una columna individual
 */
interface ColumnConfig {
    nombre?: string;    // Nombre de la columna
    tipo: string;       // Tipo de dato de la columna
    sumar?: string;     // Indica si la columna debe sumarse ('1') o no ('0')
}

/**
 * Constantes que definen los modos de suma disponibles
 */
const SUMA_MODO = {
    NO_SUMAR: '0',          // No realizar suma
    SUMAR: '1',             // Sumar valores numéricos
    CONTAR_FILAS: 'filas'   // Contar número de filas
} as const;

type SumaModoType = typeof SUMA_MODO[keyof typeof SUMA_MODO];

/**
 * Custom hook for creating a generic table using AG-Grid
 * Provides functionality for:
 * - Dynamic data loading and display
 * - Handling columns with different data types
 * - Sum and count operations
 * - Loading and error state management
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

    /**
     * Refreshes the table data
     * Triggers a new data fetch from the server
     */
    const refreshData = useCallback(async () => {
        await refetchData();
    }, [refetchData]);

    /**
     * Refreshes the table columns configuration
     * Useful when table structure changes
     */
    const refreshColumns = useCallback(async () => {
        await refetchColumns();
    }, [refetchColumns]);

    /**
     * Loads data with optional filtering
     * @param filters - Key-value pairs for filtering the data
     */
    const loadData = useCallback(async (filters?: Record<string, string>) => {
        console.log('Filters to be implemented:', filters);
        await refetchData();
    }, [refetchData]);

    /**
     * Creates an AG-Grid column definition from a column configuration
     * Handles special cases for:
     * - Primary key columns
     * - Foreign key columns
     * - Numeric columns with summation
     *
     * @param col - Column configuration object
     * @returns AG-Grid column definition
     */
    const createColumnDefinition = useCallback((col: ColumnConfig): ColDef<TableItem> => {
        const isIdField = col.nombre?.startsWith('id_') && col.nombre !== primaryId;
        const isPrimaryId = col.nombre === primaryId;
        const displayField = isIdField ? col.nombre?.replace('id_', '') : col.nombre;

        // Configure summation mode based on column type
        let sumarModo: SumaModoType = SUMA_MODO.NO_SUMAR;
        if (isPrimaryId) {
            sumarModo = SUMA_MODO.CONTAR_FILAS;
        } else if (col.tipo === 'numeric' && col.sumar === '1') {
            sumarModo = SUMA_MODO.SUMAR;
        }

        // Base column configuration
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
                isPrimary: isPrimaryId,
                esForaneo: isIdField
            },
            valueFormatter: getValueFormatterByType(col.tipo as TipoDato) as ValueFormatterFunc<TableItem>,
            wrapText: true,
            flex: 1,
        };

        // Special configuration for primary key
        if (isPrimaryId) {
            colDef.sort = 'desc' as SortDirection;
            colDef.sortIndex = 0;
            colDef.comparator = (valueA, valueB) => {
                const numA = Number(valueA);
                const numB = Number(valueB);
                return numA - numB;
            };
        }

        // Name adjustment for ID fields
        if (isIdField) {
            colDef.headerName = (displayField ?? '').replace(/_/g, ' ');
        }

        return colDef;
    }, [primaryId]);

    /**
     * Generates column definitions for the table
     * Includes:
     * - Data columns based on configuration
     * - Action column for row operations
     */
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
    }, [columnsData, createColumnDefinition]);

    /**
     * Default configuration applied to all columns
     * Sets up basic interactivity and display options
     */
    const defaultColDef = useMemo<Partial<ColDef<TableItem>>>(
        () => ({
            resizable: true,
            sortable: true,
            filter: true,
            wrapHeaderText: true,
            // Performance optimizations for columns
            suppressSizeToFit: true,      // Prevent auto-sizing calculations
            suppressAutoSize: true,       // Prevent auto-sizing calculations
            filterParams: {
                suppressAndOrCondition: true, // Simpler filter UI
            },
        }),
        [],
    );

    /**
     * AG-Grid global configuration options
     * Sets up the core functionality and behavior of the grid
     */
    const gridOptions = useMemo<GridOptions<TableItem>>(
        () => ({
            localeText: TABLE_LANGUAGE_ES,
            columnDefs,
            rowData,
            defaultColDef,
            rowBuffer: 10,                    // Number of rows rendered outside viewport
            animateRows: false,               // Disable row animations for better performance
            suppressCellFocus: true,
            rowSelection: 'single',
            columnSize: 'autoSize',
            columnSizeOptions: { skipHeader: true },
            rowModelType: 'clientSide',
            enableCellTextSelection: false,   // Disable text selection for better performance
            suppressMovableColumns: true,     // Disable column moving for better performance
            suppressColumnVirtualisation: false, // Enable column virtualization
            cacheBlockSize: 100,
            getRowId: (params) => params.data[primaryId as keyof TableItem]?.toString() ?? '',
        }),
        [columnDefs, rowData, defaultColDef, primaryId],
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
