import { FC, useState, useRef, useLayoutEffect, useMemo  } from 'react';

import { useTable } from '@/contexts/tableContext';
import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { useGenericTableSSR } from '@/hooks/modal/use-generic-data-table-ssr';
import { DynamicTableProps, TableButton, TableColumn, TableItem } from '@/types/table';
import { usePage } from '@inertiajs/react';

import { DataTable } from './data-table';
import { RenderEditButton } from './utils/shared-table-utils';
import { ColDef } from 'ag-grid-community';
import { getValueFormatterByType } from '@/lib/utils';

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

    const props = usePage().props;
    const rowData = props.data as TableItem[];
    const columns = props.columns as TableColumn[];

    const { shouldRefresh } = useTable();
    const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
    const isInitialMount = useRef(true);

    const columnDefs = useMemo<ColDef<TableColumn>[]>(() => {
        if (!columns) return [];

        const colDefs: ColDef<TableColumn>[] = columns.map((col: TableColumn) => {
            const formatter = getValueFormatterByType(col.tipo);
            return {
                cellStyle: {
                    fontWeight: 'bold',
                    textAlign: col.alineacion
                },
                context: {
                    sumar: col.sumar,
                },
                field: col.columna || '',
                flex: 1,
                headerName: col.titulo || '',
                valueFormatter: formatter,
                wrapText: true,
            } as ColDef<TableColumn>;
        });

        colDefs.push({
            cellRenderer: RenderEditButton,
            cellStyle: { fontWeight: 'bold', textAlign: 'center' },
            field: 'acciones',
            headerName: '',
            pinned: 'right',
            width: 100
        } as TableButton);

        return colDefs;
    }, [columns]);
    const { defaultColDef, loading, refreshData } = useGenericTableSSR({ columns, data: rowData });

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
