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
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

export const AgGridTable: React.FC<AgGridTableProps> = React.memo(
    ({ rowData, columnDefs, defaultColDef, selectedItem, onRowClick, onDoubleClick }) => {
        const gridRef = useRef<AgGridReact>(null);
        const [gridApi, setGridApi] = useState<GridApi | null>(null);
        const [filterText, setFilterText] = useState('');

        const onGridReady = useCallback((params: GridReadyEvent) => {
            setGridApi(params.api);
            const allColIds = params.columnApi.getAllColumns()?.map((col) => col.getColId()) || [];
            params.columnApi.autoSizeColumns(allColIds, false);
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

                if (!field || !sumar || sumar === 0) return;

                if (sumar === 'filas') {
                    footer[field] = rowData.length;
                } else if (sumar === 1 || sumar === '1') {
                    const sum = rowData.reduce((acc, data) => {
                        const val = Number((data as any)[field]);
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
