import { FormAction } from "@/types/generic";

import { FormState } from "@/types/generic";

export const initialFormState: FormState = {
    resultado: {
      abierto: false,
      mensaje: '',
      esExito: false,
    },
    formData: null,
    isSubmitting: false,
    campoEnfocar: null,
  }

// Reducer para manejar todos los estados relacionados con el formulario
export function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SHOW_RESULT':
            return {
                ...state,
                resultado: {
                    abierto: true,
                    mensaje: action.mensaje,
                    esExito: action.esExito
                },
                campoEnfocar: action.campoEnfocar || null
            };
        case 'HIDE_RESULT':
            return {
                ...state,
                resultado: {
                    ...state.resultado,
                    abierto: false
                }
            };
        case 'SET_FORM_DATA':
            return {
                ...state,
                formData: action.data
            };
        case 'SUBMIT_START':
            return {
                ...state,
                isSubmitting: true
            };
        case 'SUBMIT_END':
            return {
                ...state,
                isSubmitting: false
            };
        case 'SET_FOCUS':
            return {
                ...state,
                campoEnfocar: action.campoEnfocar
            };
        default:
            return state;
    }
}