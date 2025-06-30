import type {
  Props as ReactSelectProps,
  GroupBase,
  SingleValue,
  MultiValue,
  ActionMeta
} from 'react-select';
import type { Props as AsyncSelectProps } from 'react-select/async';
import type { Props as CreatableSelectProps } from 'react-select/creatable';

// Tipos base para opciones
export interface SelectOption {
  value: string;
  label: string;
  isDisabled?: boolean;
  data?: Record<string, unknown>;
}

// Tipos para grupos de opciones
export interface SelectOptionGroup extends GroupBase<SelectOption> {
  label: string;
  options: SelectOption[];
}

// Props base para todos los selects
export interface BaseSelectProps {
  // Props de estilo
  className?: string;
  classNames?: Record<string, (state: SelectState) => string>;
  styles?: Record<string, (base: SelectBase, state: SelectState) => SelectStyles>;

  // Props de comportamiento
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;

  // Props de validación
  error?: string;
  required?: boolean;

  // Props de accesibilidad
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;

  // Props de placeholder
  placeholder?: string;
  noOptionsMessage?: (obj: { inputValue: string }) => string;
  loadingMessage?: () => string;

  // Callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

// Props para Select básico
export interface SelectProps extends BaseSelectProps, Omit<ReactSelectProps<SelectOption, false, GroupBase<SelectOption>>, keyof BaseSelectProps> {
  value?: SingleValue<SelectOption>;
  onChange?: (value: SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void;
  options: SelectOption[] | SelectOptionGroup[];
}

// Props para AsyncSelect
export interface AsyncSelectProps extends BaseSelectProps, Omit<AsyncSelectProps<SelectOption, false, GroupBase<SelectOption>>, keyof BaseSelectProps> {
  value?: SingleValue<SelectOption>;
  onChange?: (value: SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void;
  loadOptions: (inputValue: string) => Promise<SelectOption[]>;
  defaultOptions?: boolean | SelectOption[];
  cacheOptions?: boolean;
}

// Props para CreatableSelect
export interface CreatableSelectProps extends BaseSelectProps, Omit<CreatableSelectProps<SelectOption, false, GroupBase<SelectOption>>, keyof BaseSelectProps> {
  value?: SingleValue<SelectOption>;
  onChange?: (value: SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void;
  options?: SelectOption[];
  onCreateOption?: (inputValue: string) => void;
  createOptionPosition?: 'first' | 'last';
  formatCreateLabel?: (inputValue: string) => string;
  isValidNewOption?: (inputValue: string, value: SelectOption[], options: SelectOption[]) => boolean;
}

// Props para MultiSelect
export interface MultiSelectProps extends BaseSelectProps, Omit<ReactSelectProps<SelectOption, true, GroupBase<SelectOption>>, keyof BaseSelectProps> {
  value?: MultiValue<SelectOption>;
  onChange?: (value: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void;
  options: SelectOption[] | SelectOptionGroup[];
  maxValues?: number;
  minValues?: number;
}
