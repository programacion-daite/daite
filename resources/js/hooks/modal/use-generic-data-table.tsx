import { RenderEditButton } from '@/components/table/utils/shared-table-utils';
import { getValueFormatterByType } from '@/lib/utils';
import { TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { ColDef, GridOptions } from 'ag-grid-community';
import { useCallback, useMemo } from 'react';
import { useTableColumns, useTableData, useInitialTableLoad } from '../table/use-table-queries';

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
interface TableColumn {
    columna: string;
    titulo: string;
    tipo: string;
    alineacion: 'derecha' | 'izquierda' | 'centro';
    sumar?: string;
}

interface TableColumnsData {
    encabezado: TableColumn[];
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
    // Carga inicial combinada de columnas y datos
    const {
        data: initialData,
        isLoading: isLoadingInitial,
        error: initialError,
        refetch: refetchInitial
    } = useInitialTableLoad(tableName, primaryId);

    const isInitialLoaded = !!initialData?.datos;

    const {
        data: rowData = [],
        isLoading: isLoadingData,
        error: dataError,
        refetch: refetchData
    } = useTableData(
        tableName,
        primaryId,
        true,
        isInitialLoaded ? initialData?.datos : undefined
    );

    // Usamos los datos iniciales si están disponibles, de lo contrario usamos los datos de la consulta
    const finalRowData = useMemo(() => {
        return initialData?.datos || rowData;
    }, [initialData?.datos, rowData]);

    const loading = isLoadingInitial || (isInitialLoaded && isLoadingData);
    const error = initialError?.message || dataError?.message || null;

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
        await refetchInitial();
    }, [refetchInitial]);

    /**
     * Loads data with optional filtering
     * @param filters - Key-value pairs for filtering the data
     */
    const loadData = useCallback(async (filters?: Record<string, string>) => {
        // TODO: Implementar filtros usando el ApiClient
        console.log('Filters to be implemented:', filters);
        await refetchData();
    }, [refetchData]);

    /**
     * Generates column definitions for the table
     * Includes:
     * - Data columns based on configuration
     * - Action column for row operations
     */
    const columnDefs = useMemo<ColDef<TableItem>[]>(() => {
        if (!initialData?.encabezado) return [];

        const colDefs: ColDef<TableItem>[] = initialData.encabezado.map((col: TableColumn) => {
            const formatter = getValueFormatterByType(col.tipo);
            return {
                field: col.columna || '',
                headerName: col.titulo || '',
                cellStyle: {
                    textAlign: col.alineacion === 'derecha' ? 'right' : col.alineacion === 'izquierda' ? 'left' : 'center',
                    fontWeight: 'bold',
                },
                context: {
                    sumar: col.sumar,
                },
                valueFormatter: formatter,
                wrapText: true,
                flex: 1,
            } as ColDef<TableItem>;
        });

        colDefs.push({
            field: 'acciones',
            headerName: '',
            width: 100,
            pinned: 'right',
            cellRenderer: RenderEditButton,
            cellStyle: { textAlign: 'center', fontWeight: 'bold' }
        } as ColDef<TableItem>);

        return colDefs;
    }, [initialData]);

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
            rowData: finalRowData,
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
        [columnDefs, finalRowData, defaultColDef, primaryId],
    );

    return {
        columnDefs,
        rowData: finalRowData,
        gridOptions,
        loading,
        error,
        defaultColDef,
        refreshData,
        refreshColumns,
        loadData
    };
}
