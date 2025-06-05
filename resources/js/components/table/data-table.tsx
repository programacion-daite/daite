import { numericFormat } from '@/lib/utils';
import { TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import {
    AllCommunityModule,
    ColDef,
    GridApi,
    GridReadyEvent,
    ModuleRegistry,
    RowClickedEvent,
    RowDoubleClickedEvent,
    themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { InputLabel } from '../ui/input-label';

// Registrar módulos de AG Grid solo una vez
ModuleRegistry.registerModules([AllCommunityModule]);

// Tema personalizado para la cuadrícula
const myTheme = themeQuartz.withParams({
    accentColor: '#005CAC',
    backgroundColor: '#FFFFFF',
    borderColor: '#03009826',
    browserColorScheme: 'light',
    cellHorizontalPaddingScale: 1,
    cellTextColor: '#000000',
    fontFamily: 'inherit',
    fontSize: 11,
    foregroundColor: '#000000',
    headerBackgroundColor: '#005CAC',
    headerFontFamily: ['-apple-system', 'Nunito'],
    headerFontSize: 11,
    headerFontWeight: 600,
    headerTextColor: '#FFFFFF',
    headerVerticalPaddingScale: 0.7,
    oddRowBackgroundColor: '#BFD6EA',
    rowVerticalPaddingScale: 0.9,
    spacing: 5,
});

interface AgGridTableProps {
    rowData: TableItem[];
    columnDefs: ColDef<TableItem>[];
    defaultColDef?: Partial<ColDef<TableItem>>;
    loading: boolean;
    selectedItem: TableItem | null;
    onRowClick: (item: TableItem) => void;
    onDoubleClick: (item: TableItem) => void;
}

export interface AgGridTableRef {
    executeGridAction: (action: 'refreshCells' | 'applyFilter', params?: unknown) => void;
    setRowData?: (data: TableItem[]) => void;
}

export const AgGridTable = forwardRef<AgGridTableRef, AgGridTableProps>(
    ({ rowData, columnDefs, defaultColDef, selectedItem, onRowClick, onDoubleClick }, ref) => {

        const gridRef = useRef<AgGridReact>(null);
        const [gridApi, setGridApi] = useState<GridApi | null>(null);
        const [filterText, setFilterText] = useState('');
        const footerLoggedRef = useRef(false);

        // Estabilizar rowData y columnDefs para reducir re-renderizados
        const stableRowData = useMemo(() => rowData, [JSON.stringify(rowData)]);
        const stableColumnDefs = useMemo(() => columnDefs, [JSON.stringify(columnDefs)]);

        // Calcular el footer una vez y memorizarlo
        const footerData = useMemo(() => {
            if (!stableRowData.length || !stableColumnDefs.length) return {};

            const footer: Record<string, any> = {};
            let loggedMessage = false;

            stableColumnDefs.forEach((col) => {
                const field = col.field;
                const sumar = col.context?.sumar;

                if (!field || !sumar || sumar === '0' || sumar === 0) return;

                // Solo loguear la primera vez en esta sesión
                if (!footerLoggedRef.current && !loggedMessage) {

                    loggedMessage = true;
                }

                if (sumar === 'filas') {
                    footer[field] = stableRowData.length;
                } else if (sumar === 1 || sumar === '1') {
                    const sum = stableRowData.reduce((acc, data) => {
                        const rawValue = data[field as keyof TableItem];
                        const val = Number(rawValue);

                        if (isNaN(val) && !footerLoggedRef.current) {
                            console.warn(`Valor NaN detectado en campo ${field}:`, rawValue);
                        }

                        return acc + (isNaN(val) ? 0 : val);
                    }, 0);
                    footer[field] = numericFormat(sum, 2);
                }
            });

            if (!footerLoggedRef.current && Object.keys(footer).length > 0) {

                footerLoggedRef.current = true;
            }

            return footer;
        }, [stableRowData, stableColumnDefs]);

        // Actualizar el footer solo cuando el API de la grilla esté lista
        // o cuando los datos del footer cambien
        useEffect(() => {
            if (!gridApi) return;

            // Solo actualizar si hay datos en el footer
            if (Object.keys(footerData).length > 0) {
                gridApi.setGridOption('pinnedBottomRowData', [footerData]);
            }
        }, [gridApi, footerData]);

        const onGridReady = useCallback((params: GridReadyEvent) => {
            setGridApi(params.api);
            // const allColIds = params.columnApi.getAllColumns()?.map((col) => col.getColId()) || [];
            // params.columnApi.autoSizeColumns(allColIds, false);
        }, []);

        useEffect(() => {
            if (gridApi) {
                gridApi?.setGridOption('quickFilterText', filterText);
            }
        }, [filterText, gridApi]);

        useEffect(() => {
            if (!gridApi) return;

            const footer: Record<string, any> = {};

            columnDefs.forEach((col) => {
                const field = col.field;
                // Accedemos a sumar desde el context
                const sumar = col.context?.sumar;

                if (!field || !sumar || sumar === '0' || sumar === 0) return;



                if (sumar === 'filas') {
                    footer[field] = rowData.length;
                } else if (sumar === 1 || sumar === '1') {
                    const sum = rowData.reduce((acc, data) => {
                        // Añadimos un log para ver qué valores estamos sumando
                        const rawValue = (data as any)[field];
                        const val = Number(rawValue);

                        if (isNaN(val)) {
                            console.warn(`Valor NaN detectado en campo ${field}:`, rawValue);
                        }

                        return acc + (isNaN(val) ? 0 : val);
                    }, 0);
                    footer[field] = numericFormat(sum, 2);
                }
            });

            gridApi.setGridOption('pinnedBottomRowData', [footer]);
        }, [gridApi, rowData, columnDefs]);

        useEffect(() => {
            if (!gridApi || !selectedItem) return;
            gridApi.forEachNode((node) => node.setSelected(node.data === selectedItem));
        }, [gridApi, selectedItem]);

        const handleRowClicked = useCallback((e: RowClickedEvent) => onRowClick(e.data), [onRowClick]);

        const handleRowDoubleClicked = useCallback((e: RowDoubleClickedEvent) => onDoubleClick(e.data), [onDoubleClick]);

        useImperativeHandle(
            ref,
            () => ({
                executeGridAction: (action: 'refreshCells' | 'applyFilter', params?: unknown) => {
                    if (!gridApi) return;

                    switch (action) {
                        case 'refreshCells':

                            gridApi.refreshCells({ force: true });
                            break;
                        // case 'applyFilter':
                        //  // Implementa lógica para aplicar filtros si es necesario
                        //  break;
                        default:
                            console.warn(`Acción no soportada: ${action}`);
                    }
                },
                setRowData: (data: TableItem[]) => {
                    if (!gridApi) return;
                    gridApi.setGridOption('rowData', data);
                },
            }),
            [gridApi],
        );

        return (
            <>
                <div className="flex items-center space-x-2 p-2">
                    <InputLabel label="Buscar" id="buscar" name="buscar" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                </div>

                <div className="flex h-[450px] w-full flex-col rounded-md border border-gray-200 shadow-sm">
                    {/* Input de búsqueda */}
                    <div className="relative flex-1">
                        <AgGridReact
                            ref={gridRef}
                            localeText={TABLE_LANGUAGE_ES}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            onRowClicked={handleRowClicked}
                            onRowDoubleClicked={handleRowDoubleClicked}
                            rowSelection="single"
                            animateRows={false}
                            theme={myTheme}
                            domLayout="normal"
                            pagination
                            paginationPageSize={50} // Paginación con 50 filas
                            rowBuffer={10} // Virtualización de filas
                            getRowStyle={({ node }) =>
                                node.rowPinned === 'bottom'
                                    ? {
                                          backgroundColor: '#005CAC', // mismo headerBackgroundColor
                                          color: '#FFFFFF', // mismo headerTextColor
                                          fontWeight: 600, // mismo headerFontWeight
                                      }
                                    : undefined
                            }
                        />
                    </div>
                </div>
            </>
        );
    },
);

AgGridTable.displayName = 'AgGridTable';
