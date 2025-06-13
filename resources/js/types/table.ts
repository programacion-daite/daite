import { ColDef } from "ag-grid-community";

export interface ColumnConfig {
    posicion: number;
    tipo: string;
    nombre: string;
    valor_predeterminado: string | null;
    valor_nulo: boolean;
    longitud_maxima_caracteres: number | null;
    sumar?: string;
}

export interface TableItem {
    [key: string]: string | number | boolean | null | undefined;
}

export type TipoDato = 'varchar' | 'int' | 'decimal' | 'datetime' | 'bit' | 'numeric';

export interface DataTableProps {
    rowData: TableItem[];
    columnDefs: ColDef<TableItem>[];
    defaultColDef?: Partial<ColDef<TableItem>>;
    loading: boolean;
    selectedItem: TableItem | null;
    onRowClick: (item: TableItem) => void;
    onDoubleClick: (item: TableItem) => void;
    onAction?: (action: string) => void;
}

export interface DataTableRef {
    executeGridAction: (action: 'refreshCells' | 'applyFilter') => void;
    setRowData?: (data: TableItem[]) => void;
}

export interface DynamicTableProps {
    table: string;
    primaryId: string;
    onRowClick?: (item: TableItem) => void;
    onDoubleClick?: (item: TableItem) => void;
    onAction?: (action: string) => void;
    styleConfig?: {
        theme: string;
        headerColor: string;
        rowColor: string;
        oddRowColor: string;
    };
}
export interface DynamicTableRef {
    executeGridAction: (action: 'refreshCells' | 'applyFilter' | 'refreshData', params?: unknown) => void;
}

