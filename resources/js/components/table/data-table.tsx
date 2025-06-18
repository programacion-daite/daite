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
import { AgGridReact } from 'ag-grid-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { InputLabel } from '../ui/input-label';

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

        const footer = useCallback(() => {
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
                    result[field] = numericFormat(sum, 2);
                }
            });

            return result;
        }, [columnDefs, rowData]);

        useEffect(() => {
            if (!gridApi) return;
            const footerData = footer();
            if (Object.keys(footerData).length > 0) {
                gridApi.setGridOption('pinnedBottomRowData', [footerData]);
            }
        }, [gridApi, footer]);

        useEffect(() => {
            gridApi?.setGridOption('quickFilterText', filterText);
        }, [filterText, gridApi]);

        useEffect(() => {
            if (!gridApi || !selectedItem) return;
            gridApi.forEachNode((node) => node.setSelected(node.data === selectedItem));
        }, [gridApi, selectedItem]);

        const onGridReady = useCallback((params: GridReadyEvent) => {
            setGridApi(params.api);
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

        return (
            <>
                <div className="flex items-center space-x-2 p-2">
                    <InputLabel
                        label="Buscar"
                        id="buscar"
                        name="buscar"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
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
                            onRowClicked={(e: RowClickedEvent) => onRowClick(e.data)}
                            onRowDoubleClicked={(e: RowDoubleClickedEvent) => onDoubleClick(e.data)}
                            rowSelection="single"
                            animateRows={false}
                            theme={myTheme}
                            domLayout="normal"
                            pagination
                            paginationPageSize={100}
                            paginationPageSizeSelector={[100,200,500,1000]}
                            rowBuffer={10}
                            rowModelType="clientSide"
                            enableCellTextSelection={true}
                            suppressRowVirtualisation={false}
                            suppressColumnVirtualisation={false}
                            getRowStyle={({ node }) =>
                                node?.rowPinned === 'bottom'
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
