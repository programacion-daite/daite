import { FormAction } from "@/types/generic";
import { FormState } from "@/types/generic";

export const initialFormState: FormState = {
    campoEnfocar: null,
    formData: null,
    isSubmitting: false,
    resultado: {
      abierto: false,
      esExito: false,
      mensaje: '',
    },
  }

// Reducer para manejar todos los estados relacionados con el formulario
export function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SHOW_RESULT':
            return {
                ...state,
                campoEnfocar: action.campoEnfocar || null,
                resultado: {
                    abierto: true,
                    esExito: action.esExito,
                    mensaje: action.mensaje
                }
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