import { FormDataConvertible } from '@inertiajs/core';

export interface FormProps<TForm> {
    data: TForm;
    errors: Record<keyof TForm, string>;
    setData: (key: keyof TForm, value: unknown) => void;
    post: (url: string, options?: [] | object) => void;
    put: (url: string, options?: [] | object) => void;
    // Añade aquí otros métodos de Inertia useForm que necesites
}

export type FormDataType = Record<string, FormDataConvertible>;

export interface InertiaFormProps<TForm extends FormDataType> {
    data: TForm;
    errors: Partial<Record<keyof TForm, string>>;
    setData: <K extends keyof TForm>(key: K, value: TForm[K]) => void;
    post: (url: string, options?: [] | object) => void;
    put: (url: string, options?: [] | object) => void;
    // Otros métodos de Inertia useForm
}

// Props for dynamic record components
export type DynamicRecordProps = {
    tabla?: string | undefined;
    table?: string | undefined;
    primaryId: string;
}

export type DatabaseField = {
    nombre: string;
    tipo: string;
    label: string;
    requerido?: boolean;
    parametros?: Record<string, unknown>;
    placeholder?: string;
    componente?: 'InputLabel' | 'DynamicSelect' | 'DatePicker' | 'AsyncSearchSelect' | 'MaskedInput' | 'SelectComponent';
    classname?: string;
    foranea?: boolean;
    tabla_referencia?: string;
    procedimiento?: string;
    id?: string;
    campo?: string
    tipo?: string
    longitud?: string
    visible?: string
    deshabilitado?: string
    titulo?: string
    valor?: string
    ancho?: string
    json?: string
    color?: string
    selector?: string
    requerido?: string
}

export interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    fields: DatabaseField[];
    initialData?: Record<string, unknown>;
    onSubmit: (data: Record<string, unknown>) => void;
    title?: string;
}

export interface ResultModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    status: 'success' | 'error';
}

export interface DynamicTableSectionProps {
    table: string;
    primaryId: string;
    onNewClick: () => void;
    onEditClick: (item: TableItem) => void;
}



