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

export interface TableColumn {
    titulo: string
    columna: string
    tipo: string
    columna_primaria: number
    visible: number
    ancho: string
    alineacion: string
    negrita: number
    ordenable: number
    buscable: number
    sumar: string
    agrupar: number
    campo_atributos: string
    acciones?: any // Campo virtual para botones
}

export interface TableButton extends ColDef<TableColumn> {
    cellRenderer: (params: any) => React.ReactNode;
    cellStyle: { fontWeight: 'bold', textAlign: 'center' };
    field: 'acciones';
    headerName: '';
    pinned: 'right';
}

export interface TableItem {
    [key: string]: string | number | boolean | null | undefined;
}

export type DataType = 'varchar' | 'int' | 'decimal' | 'datetime' | 'bit' | 'numeric';

export interface DataTableProps {
    rowData: TableItem[];
    columnDefs: ColDef<TableColumn>[];
    defaultColDef?: Partial<ColDef<TableColumn>>;
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

