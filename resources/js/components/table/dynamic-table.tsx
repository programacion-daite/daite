import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { TableItem } from '@/types/table';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { AgGridTable, AgGridTableRef } from './data-table';
import { useGenericTable } from '@/hooks/modal/use-generic-data-table';
import { useTable } from '@/contexts/tableContext';

type DynamicTableProps = {
    tabla?: string;
    id_primario?: string;
    onRowClick?: (item: TableItem) => void;
    onDoubleClick?: (item: TableItem) => void;
    styleConfig?: {
        theme?: string;
        headerColor?: string;
        rowColor?: string;
        oddRowColor?: string;
    };
} & React.RefAttributes<DynamicTableRef>;

export interface DynamicTableRef {
    executeGridAction: (action: 'refreshCells' | 'applyFilter' | 'refreshData', params?: unknown) => void;
}

export const DynamicTable = forwardRef<DynamicTableRef, DynamicTableProps>(({
    tabla,
    id_primario,
    onRowClick,
    onDoubleClick,
    styleConfig = {
        theme: 'ag-theme-quartz',
        headerColor: '#005CAC',
        rowColor: '#FFFFFF',
        oddRowColor: '#BFD6EA'
    }
}, ref) => {
    const { shouldRefresh } = useTable();
    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
    const agGridTableRef = useRef<AgGridTableRef>(null);

    const tableParamsValue = {
        primaryId: id_primario,
        tableName: tabla
    };

    const stableTableParams = useDeepMemo(tableParamsValue, tableParamsValue);

    const { rowData, columnDefs, defaultColDef, loading, refreshData } = useGenericTable(stableTableParams);

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
        onRowClick?.(item);
    };

    const handleRowDoubleClick = (item: TableItem) => {
        onDoubleClick?.(item);
    };

    // Actualizar la tabla cuando cambia shouldRefresh
    useEffect(() => {
        if (shouldRefresh !== undefined) {
            console.log('Actualizando tabla desde DynamicTable');
            refreshData();
        }
    }, [shouldRefresh, refreshData]);

    useImperativeHandle(
        ref,
        () => ({
            executeGridAction: (action, params) => {
                if (action === 'refreshData') {
                    refreshData();
                } else if (agGridTableRef.current) {
                    agGridTableRef.current.executeGridAction(action, params);
                }
            }
        }),
        [refreshData],
    );

    return (
        <div className={`${styleConfig.theme} h-full w-full`}>
            <AgGridTable
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                loading={loading}
                selectedItem={selectedItem}
                onRowClick={handleRowClick}
                onDoubleClick={handleRowDoubleClick}
                ref={agGridTableRef}
            />
        </div>
    );
});

DynamicTable.displayName = 'DynamicTable';
