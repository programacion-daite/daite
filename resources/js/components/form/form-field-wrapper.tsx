import React from 'react';
import { FormField } from '@/components/form/form-field';
import { cn } from '@/lib/utils';
import { FormDataType } from '@/types/form';

interface FormFieldWrapperProps {
  component: React.ComponentType<any>;
  id: string;
  label: string;
  name: string;
  parametros?: Record<string, unknown>;
  data: FormDataType;
  errors: Record<string, string | undefined>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleComponentChange: (name: string) => (value: string) => void;
  className?: string;
}

export const FormFieldWrapper = React.memo(({
  component: Component,
  id,
  label,
  name,
  parametros,
  data,
  errors,
  handleInputChange,
  handleComponentChange,
  className
}: FormFieldWrapperProps) => {
  // Crear una función onValueChange específica para DynamicSelect
  const onValueChange = React.useCallback(
    (value: string) => {
      handleComponentChange(name)(value);
    },
    [handleComponentChange, name]
  );

  // Crear una función onSelect específica para DatePicker
  const onSelect = React.useCallback(
    (date: Date) => {
      handleComponentChange(name)(date.toISOString());
    },
    [handleComponentChange, name]
  );

  // Determinar qué props pasar según el tipo de componente
  const componentProps = React.useMemo(() => {
    const baseProps = {
      id,
      label,
      name,
      error: errors[name],
      parametros,
      className: cn(className, 'col-span-1')
    };

    // Si es un DynamicSelect
    if (Component.displayName === 'DynamicSelect') {
      const currentValue = data[name];
      return {
        ...baseProps,
        value: currentValue ? String(currentValue) : undefined,
        defaultValue: currentValue ? String(currentValue) : undefined,
        placeholder: 'Seleccione una opción'
      };
    }

    // Si es un DatePicker
    if (Component.displayName === 'DatePicker') {
      return {
        ...baseProps,
        value: data[name] ? new Date(data[name] as string) : undefined,
        onSelect
      };
    }

    // Para inputs regulares
    return {
      ...baseProps,
      value: data[name] || '',
      onChange: handleInputChange
    };
  }, [
    Component.displayName,
    id,
    label,
    name,
    data,
    errors,
    parametros,
    className,
    onSelect,
    handleInputChange
  ]);

  return (
    <FormField
      component={Component}
      data={data}
      errors={errors}
      onValueChange={Component.displayName === 'DynamicSelect' ? onValueChange : undefined}
      {...componentProps}
    />
  );
});
