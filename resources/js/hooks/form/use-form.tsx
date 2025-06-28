import { useCallback } from 'react';

import { FormDataType } from '@/types/form';

// Tipo genérico para la función setData de Inertia
type SetDataFn<T extends FormDataType> = <K extends keyof T>(key: K, value: any) => void;

export function useInertiaFormWrapper<T extends FormDataType>(form: {
  data: T;
  errors: Record<string, string | undefined>;
  setData: SetDataFn<T>;
  [key: string]: any;
}) {
  const { data, errors, setData } = form;

  // Manejador genérico para inputs estándar
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(name as keyof T, value);
  }, [setData]);

  // Aquí está el cambio clave: usamos string como tipo para name para hacerlo compatible
  const handleComponentChange = useCallback((name: string) => (value: any) => {
    setData(name as keyof T, value);
  }, [setData]);

  // Función helper para resetear datos
  const resetForm = useCallback((initialData: Partial<T>) => {
    Object.keys(initialData).forEach(key => {
      if (key in initialData) {
        setData(key as keyof T, initialData[key as keyof T]);
      }
    });
  }, [setData]);

  return {
    data,
    errors,
    handleComponentChange,
    handleInputChange,
    resetForm,
    setData
  };
}