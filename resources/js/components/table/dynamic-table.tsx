import { FC, useState } from 'react';

import { useGenericTableSSR } from '@/hooks/modal/use-generic-data-table-ssr';
import { DynamicTableProps, TableColumn, TableItem } from '@/types/table';
import { usePage } from '@inertiajs/react';

import { DataTable } from './data-table';

const styleConfig = {
    headerColor: '#005CAC',
    oddRowColor: '#BFD6EA',
    rowColor: '#FFFFFF',
    theme: 'ag-theme-quartz'
}

export const DynamicTable: FC<DynamicTableProps> = ({
    onAction,
    onDoubleClick,
    onRowClick,
    primaryId
}) => {

    const props = usePage().props;
    const rowData = props.data as TableItem[];
    const columns = props.columns as TableColumn[];

    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

    const { defaultColDef, loading, refreshData, columnDefs } = useGenericTableSSR({ columns, data: rowData, primaryId });

    const handleRowClick = (item: TableItem) => {
        setSelectedItem(item);
        onRowClick?.(item);
    };

    const handleRowDoubleClick = (item: TableItem) => {
        onDoubleClick?.(item);
    };

    const handleAction = (action: string) => {
        if (action === 'refreshData') {
            refreshData?.();
        }
        onAction?.(action);
    };

    return (
        <div className={`${styleConfig.theme} h-full w-full`}>
            <DataTable
                rowData={rowData}
                columnDefs={columnDefs || []}
                defaultColDef={defaultColDef || {}}
                loading={loading || false}
                selectedItem={selectedItem}
                onRowClick={handleRowClick}
                onDoubleClick={handleRowDoubleClick}
                onAction={handleAction}
            />
        </div>
    );
};
