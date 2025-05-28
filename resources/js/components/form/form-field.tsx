import React from 'react';
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
  className?: string;
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
  className?: string;

}

export function FormField({
  component: Component,
  onChange,
  onInput,
  onValueChange,
  ...props
}: FormFieldProps) {
  const componentProps = {
    ...props,
    onChange,
    onInput,
    onValueChange,
    value: props.data[props.name] || '',
    ...props.parametros
  };

  return <Component {...componentProps} />;
}
