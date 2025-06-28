import * as React from 'react';
import { forwardRef } from 'react';
import Async from 'react-select/async';

import type { AsyncSelectProps } from './types';

import { ClearIndicator, DropdownIndicator, MultiValueRemove, Option, LoadingMessage, NoOptionsMessage } from './components';
import { defaultClassNames, defaultStyles } from './helper';

const AsyncSelectComponent = forwardRef<React.ComponentRef<typeof Async>, AsyncSelectProps>((props, ref) => {

  const {
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    'aria-label': ariaLabel,
    cacheOptions = true,
    className,
    classNames = defaultClassNames,
    components = {},
    defaultOptions = true,
    error,
    loadingMessage = () => 'Cargando...',
    loadOptions,
    noOptionsMessage = ({ inputValue }: { inputValue: string }) =>
      inputValue ? `No se encontraron opciones para "${inputValue}"` : 'No hay opciones disponibles',
    required,
    styles = defaultStyles,
    ...rest
  } = props;

  const mergedComponents = {
    ClearIndicator,
    DropdownIndicator,
    LoadingMessage,
    MultiValueRemove,
    NoOptionsMessage,
    Option,
    ...components
  };

  const mergedClassNames = {
    ...defaultClassNames,
    ...classNames
  };

  const mergedStyles = {
    ...defaultStyles,
    ...styles
  };

  return (
    <div className={className}>
      <Async
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
        // Props específicas de AsyncSelect
        loadOptions={loadOptions}
        defaultOptions={defaultOptions}
        cacheOptions={cacheOptions}
        loadingMessage={loadingMessage}
        noOptionsMessage={noOptionsMessage}
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

AsyncSelectComponent.displayName = 'AsyncSelect';


export default AsyncSelectComponent;
