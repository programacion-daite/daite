import * as React from 'react';
import { forwardRef, useState } from 'react';
import Select from 'react-select';

import { Label } from '@/components/ui/label';
import { useUIConfig } from '@/hooks/use-global-config';
import { cn } from '@/lib/utils';

import type { SelectProps } from './types';

import { ClearIndicator, DropdownIndicator, MultiValueRemove, Option } from './components';
import { defaultClassNames, defaultStyles } from './helper';

const SelectComponent = forwardRef<React.ComponentRef<typeof Select>, SelectProps>((props, ref) => {

    const { defaultSearchResultsMinimum } = useUIConfig();
    const [isSearchable, setIsSearchable] = useState(true);

    if(props.options.length < defaultSearchResultsMinimum) {
        setIsSearchable(false);
    }

  const {
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    'aria-label': ariaLabel,
    className,
    classNames = defaultClassNames,
    components = {},
    error,
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
    <div className={cn("flex flex-col gap-2",className)}>
        <Label
                htmlFor={rest.id}
                className={cn(
                    "text-sm font-medium",
                    required && "after:content-['*'] after:ml-0.5 after:text-red-500"
                )}
            >
                {rest.label || ''}
            </Label>
      <Select
        ref={ref}
        unstyled
        components={mergedComponents as any}
        classNames={mergedClassNames as any}
        styles={mergedStyles as any}
        // Props de accesibilidad
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid || !!error}
        aria-required={required}
        isSearchable={isSearchable}
        // Props de error para estilos
        error={error}
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

SelectComponent.displayName = 'Select';

export default SelectComponent;
