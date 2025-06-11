import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { DynamicTableProps, TableItem } from '@/types/table';
import { FC, useState, useEffect } from 'react';
import { DataTable } from './data-table';
import { useGenericTable } from '@/hooks/modal/use-generic-data-table';
import { useTable } from '@/contexts/tableContext';

export const DynamicTable: FC<DynamicTableProps> = ({
    table,
    primaryId,
    onRowClick,
    onDoubleClick,
    onAction,
    styleConfig = {
        theme: 'ag-theme-quartz',
        headerColor: '#005CAC',
        rowColor: '#FFFFFF',
        oddRowColor: '#BFD6EA'
    }
}) => {
    const { shouldRefresh } = useTable();
    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

    const tableParamsValue = {
        primaryId,
        tableName: table
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

    const handleAction = (action: string) => {
        if (action === 'refreshData') {
            refreshData();
        }
        onAction?.(action);
    };

    useEffect(() => {
        if (shouldRefresh !== undefined) {
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
