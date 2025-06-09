import React, { forwardRef } from 'react';
import { FormDataType } from '@/types/form';
import { FormDataConvertible } from '@inertiajs/core';

type FormComponentProps = {
  id: string;
  label: string;
  name: string;
  value?: FormDataConvertible;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  autoFocus?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  [key: string]: unknown;
};

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
  component: Component,
  onChange,
  onInput,
  onValueChange,
  onKeyDown,
  autoFocus,
  tabIndex,
  ...props
}, ref) => {
  const componentProps = {
    ...props,
    onChange,
    onInput,
    onValueChange,
    onKeyDown,
    value: props.data[props.name] || '',
    autoFocus,
    ref,
    ...props.parametros,
    tabIndex
  };

  return <Component {...componentProps} />;
});

FormField.displayName = 'FormField';
