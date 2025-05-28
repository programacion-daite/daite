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
