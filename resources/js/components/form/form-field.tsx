import React from 'react';

interface FormFieldProps {
  component: React.ComponentType<any>;
  [key: string]: unknown;
}

export function FormField({
  component: Component,
  ...props
}: FormFieldProps) {
  return <Component {...props} />;
}
