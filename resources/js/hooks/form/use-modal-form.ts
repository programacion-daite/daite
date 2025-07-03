import { useForm, usePage } from '@inertiajs/react';
import { useMemo, useEffect } from 'react';
import { FormDataType, DatabaseField } from '@/types/form';
import { useResultModalStore } from '@/store/useDynamicFormStore';

interface UseModalFormProps {
  initialData: FormDataType;
  fields: DatabaseField[];
  isOpen: boolean;
  onClose: () => void;
  submitUrl: string;
}

type Error = {
  mensaje: string;
  campo_enfocar: string;
  codigo_estado: string;
}

export function useModalForm({ initialData, fields, isOpen, onClose, submitUrl }: UseModalFormProps) {
  const { openResult } = useResultModalStore();
  const propsPage = usePage().props;
  const computedInitialData = useMemo(() => {
    if (initialData && Object.keys(initialData).length > 0) return initialData;
    if (fields && fields.length > 0) {
      const data: Record<string, any> = {};
      fields.forEach(field => {
        data[field.nombre] = field.nombre.startsWith('id_') ? 0 : '';
      });
      return data;
    }
    return {};
  }, [initialData, fields]);

  const { data, errors, processing, reset, setData, post, setError } = useForm<FormDataType>(computedInitialData);

  data.table = propsPage.table;

  useEffect(() => {
    if (isOpen) {
      reset();
      setData(computedInitialData);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de campos requeridos
    const validationErrors: Record<string, string> = {};
    if (fields) {
      fields.forEach(field => {
        const visibleStr = String(field.visible);
        const isVisible = visibleStr === 'true' || visibleStr === '1';
        if (field.requerido && isVisible && (!data[field.nombre] || !String(data[field.nombre]).trim())) {
          validationErrors[field.nombre] = 'Este campo es requerido';
        }
      });
    }
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => setError(field, message));
      return;
    }
    post(submitUrl, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (errs: any) => {
        if (!errs) return;
        const errorsArray = Object.values(errs) as Error[];
        const errors = errorsArray.map((error: Error) => ({
          title: error.campo_enfocar,
          message: error.mensaje
        }));
        openResult({
          message: errorsArray[0].mensaje,
          errors,
          status: 'error',
          focusField: errorsArray[0].campo_enfocar,
        });
      },
    });
  };

  return {
    data,
    errors,
    processing,
    setData,
    setError,
    handleSubmit,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setData(e.target.name, e.target.value.replace(/,/g, '').toUpperCase()),
    handleInput: (e: React.FormEvent<HTMLInputElement>) => setData((e.target as HTMLInputElement).name, (e.target as HTMLInputElement).value),
    handleComponentChange: (name: string) => (value: string) => setData(name, value.toUpperCase()),
  };
}
