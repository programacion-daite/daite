import React from 'react';
import { FormDataType } from '../../types/form';

interface FormFieldProps {
  component: React.ComponentType<any>;
  name: string;
  data: FormDataType;
  errors: Record<string, string | undefined>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleComponentChange: (name: string) => (value: any) => void;
  [key: string]: any;
}

export function FormField({
  component: Component,
  name,
  data,
  errors,
  handleInputChange,
  handleComponentChange,
  ...rest
}: FormFieldProps) {
  // Determinar qué props pasar al componente según su tipo
  const getComponentProps = () => {
    const baseProps = {
      name,
      value: data[name] ?? '',
      error: errors[name]
    };

    // DatePicker
    if (Component.displayName === 'DatePicker') {
      return {
        ...baseProps,
        onSelect: handleComponentChange(name)
      };
    }

    // DynamicSelect
    if (Component.displayName === 'DynamicSelect') {
      return {
        ...baseProps,
        onValueChange: handleComponentChange(name)
      };
    }

    // InputLabel y otros componentes de input estándar
    return {
      ...baseProps,
      onChange: handleInputChange
    };
  };

  return <Component {...getComponentProps()} {...rest} />;
}