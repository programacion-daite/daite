import { ColDef, GridOptions } from "ag-grid-community";

export interface ColumnConfig {
    titulo: string
    columna: string
    tipo: string
    columna_primaria: string
    visible: string
    ancho: string
    alineacion: string
    negrita: string
    ordenable: string
    buscable: string
    sumar: string
    agrupar: string
    campo_atributos: string
    nombre?: string
}

export interface ModalBusquedaProps {
    title: string
    table: string
    field: string
    onSelect: (item: Record<string, unknown>) => void
}

export interface TableItem {
    id: number;
    [key: string]: string | number | boolean | null | undefined;
}

export interface TableColumnMeta {
    width?: string;
}

export type DataType = 'varchar' | 'int' | 'decimal' | 'datetime' | 'bit' | 'numeric';

export interface UseAgGridDataProps {
    loadColumns: boolean;
    fetchData: boolean;
    columnsRoute: string;
    dataRoute: string;
    parametrosColumna?: Record<string, unknown>;
    parametrosDatos?: Record<string, unknown>;
    isGeneric?: boolean;
    shouldRefresh?: boolean;
    primaryId?: string;
    tableName?: string;
}

export interface UseAgGridDataReturn {
    rowData: TableItem[];
    columnDefs: ColDef<TableItem>[];
    defaultColDef: Partial<ColDef<TableItem>>;
    loading: boolean;
    gridOptions: GridOptions<TableItem>;
    refreshData: () => Promise<void>;
    refreshColumns: () => Promise<void>;
}