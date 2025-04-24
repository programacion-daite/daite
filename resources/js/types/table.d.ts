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
    onSelect: (item: Record<string, any>) => void
}


export interface TableItem {
    id: number;
    [key: string]: string | number | boolean | null | undefined;
}

export interface TableColumnMeta {
    width?: string;
}

type TipoDato = 'int' | 'numeric' | 'datetime' | 'date' | 'string';
