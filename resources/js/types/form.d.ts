export interface FormProps<TForm> {
    data: TForm;
    errors: Record<keyof TForm, string>;
    setData: (key: keyof TForm, value: unknown) => void;
    post: (url: string, options?: [] | object) => void;
    put: (url: string, options?: [] | object) => void;
    // Añade aquí otros métodos de Inertia useForm que necesites
}

export type FormDataType = Record<string, any>;

export interface InertiaFormProps<TForm extends FormDataType> {
    data: TForm;
    errors: Partial<Record<keyof TForm, string>>;
    setData: <K extends keyof TForm>(key: K, value: TForm[K]) => void;
    post: (url: string, options?: [] | object) => void;
    put: (url: string, options?: [] | object) => void;
    // Otros métodos de Inertia useForm
}


// Esto es para los campos que me retornan de la base de datos, asi los convierto a los campos para mi form
export type RegistroDinamicoProps = {
    tabla: string;
    id_primario: string;
}
// lo de arriba
export type CampoBaseDatos = {
    nombre: string;
    tipo: string;
    label: string;
    requerido?: boolean;
    parametros?: Record<string, any>;
    placeholder?: string;
    componente?: 'InputLabel' | 'DynamicSelect' | 'DatePicker' | 'AsyncSearchSelect' | 'MaskedInput';
    classname?: string;
    foranea?: boolean;
    tabla_referencia?: string;
    procedimiento?: string;
}



