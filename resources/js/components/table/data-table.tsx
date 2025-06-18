import { numericFormat } from '@/lib/utils';
import { DataTableProps, DataTableRef, TableItem } from '@/types/table';
import { TABLE_LANGUAGE_ES } from '@/utils/table-language';
import {
    AllCommunityModule,
    GridApi,
    GridReadyEvent,
    ModuleRegistry,
    RowClickedEvent,
    RowDoubleClickedEvent,
    themeQuartz,
} from 'ag-grid-community';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { InputLabel } from '../ui/input-label';
import { AgGridReact } from 'ag-grid-react';

ModuleRegistry.registerModules([AllCommunityModule]);

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

export const DataTable = forwardRef<DataTableRef, DataTableProps>(
    ({ rowData, columnDefs, defaultColDef, selectedItem, onRowClick, onDoubleClick, onAction = () => {} }, ref) => {
        const gridRef = useRef<AgGridReact>(null);
        const [gridApi, setGridApi] = useState<GridApi | null>(null);
        const [filterText, setFilterText] = useState('');

        const footerData = useMemo(() => {
            const result: Record<string, string | number> = {};

            columnDefs.forEach((col) => {
                const field = col.field;
                const sumar = col.context?.sumar;

                if (!field || !sumar || sumar === '0') return;

                if (sumar === 'filas') {
                    result[field] = rowData.length;
                } else if (sumar === '1') {
                    const sum = rowData.reduce((acc, data) => {
                        const val = Number(data[field as keyof TableItem]);
                        return acc + (isNaN(val) ? 0 : val);
                    }, 0);
                    const formattedValue = numericFormat(sum, 2);
                    result[field] = typeof formattedValue === 'string' ? formattedValue : String(formattedValue);
                }
            });

            return result;
        }, [columnDefs, rowData]);

        useEffect(() => {
            if (!gridApi || Object.keys(footerData).length === 0) return;
            gridApi.setGridOption('pinnedBottomRowData', [footerData]);
        }, [gridApi, footerData]);

        useEffect(() => {
            if (!gridApi) return;
            gridApi.setGridOption('quickFilterText', filterText);
        }, [filterText, gridApi]);

        useEffect(() => {
            if (!gridApi || !selectedItem) return;
            gridApi.forEachNode((node) => {
                const isSelected = node.data === selectedItem;
                if (node.isSelected() !== isSelected) {
                    node.setSelected(isSelected);
                }
            });
        }, [gridApi, selectedItem]);

        const onGridReady = useCallback((params: GridReadyEvent) => {
            setGridApi(params.api);
        }, []);

        const handleRowClick = useCallback((e: RowClickedEvent) => {
            onRowClick(e.data);
        }, [onRowClick]);

        const handleRowDoubleClick = useCallback((e: RowDoubleClickedEvent) => {
            onDoubleClick(e.data);
        }, [onDoubleClick]);

        const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setFilterText(e.target.value);
        }, []);

        useImperativeHandle(
            ref,
            () => ({
                executeGridAction: (action: 'refreshCells' | 'applyFilter') => {
                    if (!gridApi) return;
                    if (action === 'refreshCells') {
                        gridApi.refreshCells({ force: true });
                    }
                },
                setRowData: (data: TableItem[]) => {
                    gridApi?.setGridOption('rowData', data);
                },
                onAction: (action: string) => {
                    onAction?.(action);
                },
            }),
            [gridApi, onAction],
        );

        const gridOptions = useMemo(() => ({
            rowBuffer: 20,
            rowModelType: 'clientSide' as const,
            suppressRowVirtualisation: false,
            suppressColumnVirtualisation: false,
            enableCellTextSelection: true,
            animateRows: false,
            pagination: true,
            paginationPageSize: 50,
            paginationPageSizeSelector: [25, 50, 100, 200, 500],
            domLayout: 'normal' as const,
            rowSelection: 'single' as const,
            quickFilterDelay: 300,
            suppressColumnMoveAnimation: true,
            suppressRowHoverHighlight: false,
            suppressScrollOnNewData: true,
            suppressAnimationFrame: false,
        }), []);

        return (
            <>
                <div className="flex items-center space-x-2 p-2">
                    <InputLabel
                        label="Buscar"
                        id="buscar"
                        name="buscar"
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="flex h-[450px] w-full flex-col rounded-md border border-gray-200 shadow-sm">
                    <div className="relative flex-1">
                        <AgGridReact
                            ref={gridRef}
                            localeText={TABLE_LANGUAGE_ES}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            onRowClicked={handleRowClick}
                            onRowDoubleClicked={handleRowDoubleClick}
                            theme={myTheme}
                            {...gridOptions}
                            getRowStyle={(params) =>
                                params.node?.rowPinned === 'bottom'
                                    ? {
                                          backgroundColor: '#005CAC',
                                          color: '#FFFFFF',
                                          fontWeight: 600,
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

DataTable.displayName = 'DataTable';
