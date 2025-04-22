import { useDeepMemo } from '@/hooks/general/use-deepmemo';
import { useAgGridData } from '@/hooks/modal/use-data-table';
import { TableItem } from '@/types/table';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { AgGridTable, AgGridTableRef } from './data-table';
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

    const columnsParamValue = { tabla };
    const dataParamValue = {
        origen_registros: tabla,
        campo_ordenar: id_primario,
    };

    const tableParamsValue = {
        loadColumns: true,
        columnsRoute: 'esquema',
        fetchData: true,
        dataRoute: 'registrosConsultaPrincipal',
        parametrosColumna: columnsParamValue,
        parametrosDatos: dataParamValue,
        isGeneric: true,
        styleConfig
    };

    const stableTableParams = useDeepMemo(tableParamsValue, tableParamsValue);

    const { rowData, columnDefs, defaultColDef, loading, refreshData } = useAgGridData(stableTableParams);

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
                    console.log('Ejecutando refreshData desde executeGridAction');
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
