import * as React from 'react';
import { forwardRef } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';

import type { MultiSelectProps, SelectOption } from './types';

import { ClearIndicator, DropdownIndicator, MultiValueRemove, Option } from './components';
import { defaultClassNames, defaultStyles } from './helper';

const MultiSelectComponent = forwardRef<React.ComponentRef<typeof Select>, MultiSelectProps>((props, ref) => {
  const {
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    'aria-label': ariaLabel,
    className,
    classNames = defaultClassNames,
    components = {},
    error,
    maxValues,
    minValues,
    onChange,
    required,
    styles = defaultStyles,
    ...rest
  } = props;

  // Combinar componentes personalizados con los por defecto
  const mergedComponents = {
    ClearIndicator,
    DropdownIndicator,
    MultiValueRemove,
    Option,
    ...components
  };

  // Combinar classNames personalizados con los por defecto
  const mergedClassNames = {
    ...defaultClassNames,
    ...classNames
  };

  // Combinar estilos personalizados con los por defecto
  const mergedStyles = {
    ...defaultStyles,
    ...styles
  };

  // Validación de valores mínimos y máximos
  const handleChange = (newValue: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
    if (maxValues && newValue && newValue.length > maxValues) {
      return; // No permitir más valores
    }

    if (onChange) {
      onChange(newValue, actionMeta);
    }
  };

  return (
    <div className={className}>
      <Select
        ref={ref}
        unstyled
        isMulti
        components={mergedComponents}
        classNames={mergedClassNames}
        styles={mergedStyles}
        // Props de accesibilidad
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid || !!error}
        aria-required={required}
        // Props de error para estilos
        error={error}
        // Props específicas de MultiSelect
        onChange={handleChange}
        {...rest}
      />
      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
      {/* Mensaje de límites */}
      {maxValues && (
        <p className="text-xs text-muted-foreground mt-1">
          Máximo {maxValues} opciones
        </p>
      )}
      {minValues && (
        <p className="text-xs text-muted-foreground mt-1">
          Mínimo {minValues} opciones
        </p>
      )}
    </div>
  );
});

MultiSelectComponent.displayName = 'MultiSelect';

export default MultiSelectComponent;
