import axios from 'axios';
import { useReducer, useCallback } from 'react';

import type { TableItem } from '@/types/table';

import { construirJSONGenerico } from '@/lib/utils';
import { formReducer, initialFormState } from '@/reducers/formReducer';

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
      dispatch({ campoEnfocar: campo, esExito, mensaje, type: 'SHOW_RESULT' });
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
          dispatch({ data: datos, type: 'SET_FORM_DATA' });
          dispatch({ campoEnfocar: data.campo_enfocar || null, type: 'SET_FOCUS' });
          mostrarResultado(data.mensaje, false, data.campo_enfocar);
        } else {
          dispatch({ data: null, type: 'SET_FORM_DATA' });
          dispatch({ campoEnfocar: null, type: 'SET_FOCUS' });
          mostrarResultado('Datos guardados correctamente', true);
          refreshTable();
          setModalAbierto(false);
        }
      } catch (error) {
        console.error('Error al enviar datos:', error);
        dispatch({ data: datos, type: 'SET_FORM_DATA' });
        mostrarResultado('Error al enviar los datos. Por favor, inténtelo de nuevo.', false);
      } finally {
        setIsLoading(false);
        dispatch({ type: 'SUBMIT_END' });
      }
    },
    [tabla, refreshTable, setIsLoading, setModalAbierto, mostrarResultado]
  );

  const openNew = useCallback(() => {
    dispatch({ data: null, type: 'SET_FORM_DATA' });
    setModalAbierto(true);
  }, [setModalAbierto]);

  const openEdit = useCallback(
    (item: TableItem) => {
      dispatch({ data: item, type: 'SET_FORM_DATA' });
      setModalAbierto(true);
    },
    [setModalAbierto]
  );

  const closeForm = useCallback(() => {
    dispatch({ data: null, type: 'SET_FORM_DATA' });
    setModalAbierto(false);
  }, [setModalAbierto]);

  return {
    closeForm,
    handleSubmit,
    openEdit,
    openNew,
    state,
  };
}