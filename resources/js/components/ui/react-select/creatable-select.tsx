import * as React from 'react';
import { forwardRef } from 'react';
import Creatable from 'react-select/creatable';

import type { CreatableSelectProps } from './types';

import { ClearIndicator, DropdownIndicator, MultiValueRemove, Option } from './components';
import { defaultClassNames, defaultStyles } from './helper';

const CreatableSelectComponent = forwardRef<React.ComponentRef<typeof Creatable>, CreatableSelectProps>((props, ref) => {
  const {
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    'aria-label': ariaLabel,
    className,
    classNames = defaultClassNames,
    components = {},
    createOptionPosition = 'last',
    error,
    formatCreateLabel = (inputValue: string) => `Crear "${inputValue}"`,
    isValidNewOption = (inputValue: string) => inputValue.trim().length > 0,
    onCreateOption,
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

  return (
    <div className={className}>
      <Creatable
        ref={ref}
        unstyled
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
        // Props específicas de CreatableSelect
        onCreateOption={onCreateOption}
        createOptionPosition={createOptionPosition}
        formatCreateLabel={formatCreateLabel}
        isValidNewOption={isValidNewOption}
        {...rest}
      />
      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

CreatableSelectComponent.displayName = 'CreatableSelect';

export default CreatableSelectComponent;
