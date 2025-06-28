import { FC, useState, useRef, useLayoutEffect } from 'react';

import { useTable } from '@/contexts/tableContext';
import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { useGenericTable } from '@/hooks/modal/use-generic-data-table';
import { DynamicTableProps, TableItem } from '@/types/table';

import { DataTable } from './data-table';





export const DynamicTable: FC<DynamicTableProps> = ({
    onAction,
    onDoubleClick,
    onRowClick,
    primaryId,
    styleConfig = {
        headerColor: '#005CAC',
        oddRowColor: '#BFD6EA',
        rowColor: '#FFFFFF',
        theme: 'ag-theme-quartz'
    },
    table
}) => {
    const { shouldRefresh } = useTable();
    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
    const isInitialMount = useRef(true);

    const tableParamsValue = {
        primaryId,
        tableName: table
    };

    const stableTableParams = useDeepMemo(tableParamsValue, tableParamsValue);
    const { columnDefs, defaultColDef, loading, refreshData, rowData } = useGenericTable(stableTableParams);

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
        onRowClick?.(item);
    };

    const handleRowDoubleClick = (item: TableItem) => {
        onDoubleClick?.(item);
    };

    const handleAction = (action: string) => {
        if (action === 'refreshData') {
            refreshData();
        }
        onAction?.(action);
    };

    useLayoutEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (shouldRefresh !== undefined) {
            refreshData();
        }
    }, [shouldRefresh, refreshData]);

    return (
        <div className={`${styleConfig.theme} h-full w-full`}>
            <DataTable
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                loading={loading}
                selectedItem={selectedItem}
                onRowClick={handleRowClick}
                onDoubleClick={handleRowDoubleClick}
                onAction={handleAction}
            />
        </div>
    );
};
