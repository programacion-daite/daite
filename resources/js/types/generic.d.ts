export interface FormState {
    resultado: {
        abierto: boolean;
        mensaje: string;
        esExito: boolean;
    };
    formData: Record<string, unknown> | null;
    isSubmitting: boolean;
    campoEnfocar: string | null;
}

export type FormAction =
    | { type: 'SHOW_RESULT'; mensaje: string; esExito: boolean; campoEnfocar?: string }
    | { type: 'HIDE_RESULT' }
    | { type: 'SET_FORM_DATA'; data: Record<string, unknown> | null }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_END' }
    | { type: 'SET_FOCUS'; campoEnfocar: string | null };
