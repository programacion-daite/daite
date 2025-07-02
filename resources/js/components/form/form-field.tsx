import React, { forwardRef } from 'react';

import { FormDataType } from '@/types/form';

interface FormFieldProps {
  component: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  id: string;
  label: string;
  name: string;
  parametros?: Record<string, unknown>;
  data: FormDataType;
  errors: Record<string, string | undefined>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  autoFocus?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  tabIndex?: number;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  autoFocus,
  component: Component,
  onChange,
  onInput,
  onKeyDown,
  onValueChange,
  tabIndex,
  ...props
}, ref) => {
  const componentProps = {
    ...props,
    autoFocus,
    onChange,
    onInput,
    onKeyDown,
    onValueChange,
    ref,
    value: props.data[props.name] || '',
    error: props.errors[props.name],
    ...props.parametros,
    tabIndex
  };

  return <Component {...componentProps} />;
});

FormField.displayName = 'FormField';
