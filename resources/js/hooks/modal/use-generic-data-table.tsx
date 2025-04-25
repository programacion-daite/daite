import { RenderEditButton } from '@/components/table/utils/shared-table-utils';
import { getValueFormatterByType } from '@/lib/utils';
import { ColumnConfig, TableItem, TipoDato } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import { ColDef, GridOptions, SortDirection, ValueFormatterFunc } from 'ag-grid-community';
import axios from 'axios';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';

interface UseGenericTableProps {
    tableName: string | undefined;
    primaryId: string | undefined;
    loadImmediately?: boolean;
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
    primaryId,
    loadImmediately = true
}: UseGenericTableProps): UseAgGridDataReturn {
    const [columns, setColumns] = useState<ColumnConfig[]>([]);
    const [rowData, setRowData] = useState<TableItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMultipleIds, setHasMultipleIds] = useState(false);
    const columnsRoute = 'esquema';
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loggedOnce = useRef(false);

    const stableTableName = useMemo(() => tableName, [tableName]);
    const stablePrimaryId = useMemo(() => primaryId, [primaryId]);

    const fetchColumns = useCallback(async () => {
        try {
            const columnsParameters = {
                tabla: stableTableName,
            };

            const response = await axios.post(
                route(columnsRoute), columnsParameters,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            );

            const resultado = response.data[0].original ?? response.data[0];
            const hasForeignIDs = resultado.filter((col: ColumnConfig) => col.nombre && stablePrimaryId && col.nombre?.startsWith('id_')).length > 1;

            setHasMultipleIds(hasForeignIDs);
            setColumns(resultado);

            if (!loggedOnce.current) {
                console.log("Columnas cargadas:", resultado);
                loggedOnce.current = true;
            }

            return hasForeignIDs;
        } catch (error) {
            console.error('Error fetching generic columns:', error);
            throw error;
        }
    }, [stableTableName, stablePrimaryId, columnsRoute]);

    // Fetch data para genéricas
    const fetchTableData = useCallback(async (useHasMultipleIds?: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const shouldUseMultipleIds = useHasMultipleIds !== undefined ? useHasMultipleIds : hasMultipleIds;

            const routeToUse = shouldUseMultipleIds ? 'traerRegistrosCombinados' : 'registrosConsultaPrincipal';
            const params = shouldUseMultipleIds
                ? { renglon: stableTableName }
                : { origen_registros: stableTableName, campo_ordenar: stablePrimaryId };

            const response = await axios.post(route(routeToUse), params, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            const resultado = response.data[0].original;
            setRowData(Array.isArray(resultado) ? resultado : []);
        } catch (error) {
            console.error('Error fetching generic data:', error);
            setError("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    }, [stableTableName, stablePrimaryId, hasMultipleIds]);

    const loadFullData = useCallback(async () => {
        if (!stableTableName) return;

        try {
            setLoading(true);
            setError(null);
            const multipleIds = await fetchColumns();
            await fetchTableData(multipleIds);
            setInitialized(true);
        } catch (error) {
            console.error("Error loading data:", error);
            setError("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    }, [fetchColumns, fetchTableData, stableTableName]);

    useEffect(() => {
        if (loadImmediately && stableTableName && !initialized) {
            loadFullData();
        }
    }, [loadImmediately, stableTableName, initialized, loadFullData]);

    // Public refresh methods
    const refreshData = useCallback(async () => {
        await fetchTableData();
    }, [fetchTableData]);

    const refreshColumns = useCallback(async () => {
        await fetchColumns();
    }, [fetchColumns]);

    const loadData = useCallback(async (filters?: Record<string, string>) => {
        console.log('Cargando datos con filtros:', filters);
        await loadFullData();
    }, [loadFullData]);

    // Column definitions específicas para genéricas
    const columnDefs = useMemo<ColDef<TableItem>[]>(() => {
        if (columns.length === 0) return [];

        if (!loggedOnce.current) {
            console.log("Columnas a procesar:", columns.map(c => ({
                nombre: c.nombre,
                tipo: c.tipo,
                sumar: c.sumar
            })));
        }

        // 1. Crear las columnas base
        const colDefs: ColDef<TableItem>[] = [];

        // 2. Procesar y añadir todas las columnas
        columns.forEach((col) => {
            const esCampoId = col.nombre?.startsWith('id_') && col.nombre !== stablePrimaryId;
            const esIdPrimario = col.nombre === stablePrimaryId;

            // Determinar nombre del campo a mostrar (sin id_ para foráneas)
            const displayField = esCampoId ? col.nombre?.replace('id_', '') : col.nombre;

            // Configurar el modo de suma
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

            if (esIdPrimario && hasMultipleIds) {
                colDef.sort = 'desc' as SortDirection;
                colDef.sortIndex = 0;
            }

            if (esCampoId) {
                colDef.headerName = (displayField ?? '').replace(/_/g, ' ');
            }

            colDefs.push(colDef);
        });

        // 3. Añadir columna de acciones
        colDefs.push({
            field: 'acciones',
            headerName: '',
            width: 100,
            pinned: 'right',
            cellRenderer: RenderEditButton,
            cellStyle: { textAlign: 'center' }
        });

        return colDefs;
    }, [columns, stablePrimaryId]);

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
