import { useReducer, useCallback } from 'react';
import { formReducer } from '@/reducers/formReducer';
import { construirJSONGenerico } from '@/lib/utils';
import axios from 'axios';
import { useTable } from '@/contexts/tableContext';

export const useDynamicForm = (tabla: string, setModalAbierto: (open: boolean) => void) => {
    const { setIsLoading, refreshTable } = useTable();

    const [formState, dispatch] = useReducer(formReducer, {
        resultado: {
            abierto: false,
            mensaje: '',
            esExito: false
        },
        formData: null,
        isSubmitting: false,
        campoEnfocar: null
    });

    const mostrarResultado = useCallback((mensaje: string, esExito: boolean) => {
        dispatch({ type: 'SHOW_RESULT', mensaje, esExito });
    }, []);

    const cerrarResultado = useCallback(() => {
        dispatch({ type: 'HIDE_RESULT' });
    }, []);

    const handleSubmit = useCallback(async (datos: Record<string, unknown>) => {
        const jsonData = construirJSONGenerico(datos, tabla);
        const params = { json: JSON.stringify(jsonData) };

        setIsLoading(true);
        dispatch({ type: 'SUBMIT_START' });

        try {
            const response = await axios.post(route('registrarRegistros'), params);
            const data = response.data[0].original[0];

            if (data.codigo_estado !== '200') {
                dispatch({ type: 'SET_FORM_DATA', data: datos });
                dispatch({ type: 'SET_FOCUS', campoEnfocar: data?.campo_enfocar || null });
                mostrarResultado(data.mensaje, false);
            } else {
                dispatch({ type: 'SET_FORM_DATA', data: null });
                dispatch({ type: 'SET_FOCUS', campoEnfocar: null });
                mostrarResultado('Datos guardados correctamente', true);
                refreshTable();
                setModalAbierto(false);
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
            dispatch({ type: 'SET_FORM_DATA', data: datos });
            mostrarResultado('Error al enviar los datos. Por favor, inténtelo de nuevo.', false);
        } finally {
            setIsLoading(false);
            dispatch({ type: 'SUBMIT_END' });
        }
    }, [tabla, setIsLoading, refreshTable, setModalAbierto, mostrarResultado]);

    const resetFormData = useCallback(() => {
        dispatch({ type: 'SET_FORM_DATA', data: null });
    }, []);

    return {
        formState,
        handleSubmit,
        mostrarResultado,
        cerrarResultado,
        resetFormData
    };
};
