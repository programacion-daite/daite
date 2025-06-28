import type {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  MultiValueRemoveProps,
  OptionProps
} from 'react-select';

import { ChevronDown, Check, X } from 'lucide-react';
import { components } from 'react-select';

import type { SelectOption } from './types';

// Componente para el indicador de dropdown
export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </components.DropdownIndicator>
  );
};

// Componente para el indicador de limpiar
export const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <X className="h-3.5 w-3.5 opacity-50" />
    </components.ClearIndicator>
  );
};

// Componente para remover valores múltiples
export const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <X className="h-3 w-3 opacity-50" />
    </components.MultiValueRemove>
  );
};

// Componente para las opciones
export const Option = (props: OptionProps<SelectOption>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <div>{props.data.label}</div>
        {props.isSelected && <Check className="h-4 w-4" />}
      </div>
    </components.Option>
  );
};

// Componente para el mensaje de carga
export const LoadingMessage = () => (
  <div className="flex items-center justify-center py-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
    <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
  </div>
);

// Componente para el mensaje de sin opciones
export const NoOptionsMessage = ({ inputValue }: { inputValue: string }) => (
  <div className="py-2 px-2 text-sm text-muted-foreground">
    {inputValue ? `No se encontraron opciones para "${inputValue}"` : 'No hay opciones disponibles'}
  </div>
);
