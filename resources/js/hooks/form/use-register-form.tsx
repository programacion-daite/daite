import { useReducer, useCallback } from 'react';
import axios from 'axios';
import { construirJSONGenerico } from '@/lib/utils';
import { formReducer, initialFormState } from '@/reducers/formReducer';
import type { TableItem } from '@/types/table';

type SubmitData = Record<string, unknown>;

export function useRegistroForm(
  tabla: string,
  refreshTable: () => void,
  setIsLoading: (v: boolean) => void,
  setModalAbierto: (v: boolean) => void
) {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const mostrarResultado = useCallback(
    (mensaje: string, esExito: boolean, campo?: string) => {
      dispatch({ type: 'SHOW_RESULT', mensaje, esExito, campoEnfocar: campo });
    },
    []
  );

  const handleSubmit = useCallback(
    async (datos: SubmitData) => {
      const jsonData = construirJSONGenerico(datos, tabla);
      setIsLoading(true);
      dispatch({ type: 'SUBMIT_START' });

      try {
        const response = await axios.post(route('registrarRegistros'), {
          json: JSON.stringify(jsonData),
        });
        const data = response.data[0].original[0];

        if (data.codigo_estado !== '200') {
          dispatch({ type: 'SET_FORM_DATA', data: datos });
          dispatch({ type: 'SET_FOCUS', campoEnfocar: data.campo_enfocar || null });
          mostrarResultado(data.mensaje, false, data.campo_enfocar);
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
    },
    [tabla, refreshTable, setIsLoading, setModalAbierto, mostrarResultado]
  );

  const openNew = useCallback(() => {
    dispatch({ type: 'SET_FORM_DATA', data: null });
    setModalAbierto(true);
  }, [setModalAbierto]);

  const openEdit = useCallback(
    (item: TableItem) => {
      dispatch({ type: 'SET_FORM_DATA', data: item });
      setModalAbierto(true);
    },
    [setModalAbierto]
  );

  const closeForm = useCallback(() => {
    dispatch({ type: 'SET_FORM_DATA', data: null });
    setModalAbierto(false);
  }, [setModalAbierto]);

  return {
    state,
    handleSubmit,
    openNew,
    openEdit,
    closeForm,
  };
}