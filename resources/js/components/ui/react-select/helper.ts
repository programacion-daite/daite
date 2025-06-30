import { cn } from '@/lib/utils';

type SelectStateType = {
  isDisabled?: boolean;
  isFocused?: boolean;
  isSelected?: boolean;
  selectProps: {
    error?: boolean;
  };
};

const controlStyles = {
  base: 'flex !min-h-9 w-full rounded-md border border-input bg-transparent pl-3 py-1 pr-1 gap-1 text-sm shadow-sm transition-colors hover:cursor-pointer',
  disabled: 'cursor-not-allowed opacity-50',
  error: 'border-destructive ring-destructive',
  focus: 'outline-none ring-1 ring-ring'
};

const placeholderStyles = 'text-sm text-muted-foreground';
const valueContainerStyles = 'gap-1';
const multiValueStyles = 'inline-flex items-center gap-2 rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-1.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
const indicatorsContainerStyles = 'gap-1';
const clearIndicatorStyles = 'p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors';
const indicatorSeparatorStyles = 'bg-border';
const dropdownIndicatorStyles = 'p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors';
const menuStyles = 'p-1 mt-1 border bg-popover shadow-md rounded-md text-popover-foreground z-50';
const groupHeadingStyles = 'py-2 px-1 text-secondary-foreground text-sm font-semibold';
const optionStyles = {
  base: 'hover:cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1.5 rounded-sm !text-sm !cursor-default !select-none !outline-none font-sans transition-colors',
  disabled: 'pointer-events-none opacity-50',
  focus: 'active:bg-accent/90 bg-accent text-accent-foreground',
  selected: 'bg-primary text-primary-foreground hover:bg-primary/90'
};
const noOptionsMessageStyles = 'text-accent-foreground p-2 bg-accent border border-dashed border-border rounded-sm';
const loadingIndicatorStyles = 'flex items-center justify-center h-4 w-4 opacity-50';
const loadingMessageStyles = 'text-accent-foreground p-2 bg-accent';

/**
 * Factory method para construir configuración de classNames personalizada
 */
export const createClassNames = (customClassNames?: Record<string, (state: SelectStateType) => string>) => {
  return {
    clearIndicator: (state: SelectStateType) =>
      cn(clearIndicatorStyles, customClassNames?.clearIndicator?.(state)),
    container: (state: SelectStateType) => cn(customClassNames?.container?.(state)),
    control: (state: SelectStateType) =>
      cn(
        controlStyles.base,
        state.isDisabled && controlStyles.disabled,
        state.isFocused && controlStyles.focus,
        state.selectProps.error && controlStyles.error,
        customClassNames?.control?.(state)
      ),
    dropdownIndicator: (state: SelectStateType) =>
      cn(dropdownIndicatorStyles, customClassNames?.dropdownIndicator?.(state)),
    group: (state: SelectStateType) => cn(customClassNames?.group?.(state)),
    groupHeading: (state: SelectStateType) =>
      cn(groupHeadingStyles, customClassNames?.groupHeading?.(state)),
    indicatorsContainer: (state: SelectStateType) =>
      cn(indicatorsContainerStyles, customClassNames?.indicatorsContainer?.(state)),
    indicatorSeparator: (state: SelectStateType) =>
      cn(indicatorSeparatorStyles, customClassNames?.indicatorSeparator?.(state)),
    input: (state: SelectStateType) => cn(customClassNames?.input?.(state)),
    loadingIndicator: (state: SelectStateType) =>
      cn(loadingIndicatorStyles, customClassNames?.loadingIndicator?.(state)),
    loadingMessage: (state: SelectStateType) =>
      cn(loadingMessageStyles, customClassNames?.loadingMessage?.(state)),
        menu: (state: SelectStateType) => cn(menuStyles, customClassNames?.menu?.(state)),
    menuList: (state: SelectStateType) => cn(customClassNames?.menuList?.(state)),
    menuPortal: (state: SelectStateType) => cn(customClassNames?.menuPortal?.(state)),
    multiValue: (state: SelectStateType) =>
      cn(multiValueStyles, customClassNames?.multiValue?.(state)),
    multiValueLabel: (state: SelectStateType) => cn(customClassNames?.multiValueLabel?.(state)),
    multiValueRemove: (state: SelectStateType) => cn(customClassNames?.multiValueRemove?.(state)),
    noOptionsMessage: (state: SelectStateType) =>
      cn(noOptionsMessageStyles, customClassNames?.noOptionsMessage?.(state)),
    option: (state: SelectStateType) =>
      cn(
        optionStyles.base,
        state.isFocused && optionStyles.focus,
        state.isDisabled && optionStyles.disabled,
        state.isSelected && optionStyles.selected,
        customClassNames?.option?.(state)
      ),
    placeholder: (state: SelectStateType) =>
      cn(placeholderStyles, customClassNames?.placeholder?.(state)),
    singleValue: (state: SelectStateType) => cn(customClassNames?.singleValue?.(state)),
    valueContainer: (state: SelectStateType) =>
      cn(valueContainerStyles, customClassNames?.valueContainer?.(state))
  };
};

// ClassNames por defecto
export const defaultClassNames = createClassNames({});

// Estilos por defecto que complementan los classNames
export const defaultStyles = {
  control: (base: Record<string, unknown>, state: SelectStateType) => ({
    ...base,
    '&:hover': {
      borderColor: state.selectProps.error ? 'hsl(var(--destructive))' : base.borderColor
    },
    borderColor: state.selectProps.error ? 'hsl(var(--destructive))' : base.borderColor,
    borderWidth: state.selectProps.error ? '1px' : base.borderWidth,
    boxShadow: 'none',
    transition: 'none'
  }),
  input: (base: Record<string, unknown>) => ({
    ...base,
    'input:focus': {
      boxShadow: 'none'
    }
  }),
  menuList: (base: Record<string, unknown>) => ({
    ...base,
    '::-webkit-scrollbar': {
      background: 'transparent',
      width: '8px'
    },
    '::-webkit-scrollbar-thumb': {
      background: 'hsl(var(--border))',
      borderRadius: '4px'
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: 'hsl(var(--muted-foreground))'
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent'
    }
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    overflow: 'visible',
    whiteSpace: 'normal'
  }),
  option: (base: Record<string, unknown>, state: SelectStateType) => ({
    ...base,
    // !TODO: revisar estilos
    // '&:hover': {
    //   backgroundColor: state.isSelected
    //     ? 'hsl(var(--primary))'
    //     : 'hsl(var(--accent))',
    //   color: state.isSelected
    //     ? 'hsl(var(--primary-foreground))'
    //     : 'hsl(var(--accent-foreground))'
    // },
    // backgroundColor: state.isSelected
    //   ? 'hsl(var(--primary))'
    //   : state.isFocused
    //     ? 'hsl(var(--accent))'
    //     : 'transparent',
    // color: state.isSelected
    //   ? 'hsl(var(--primary-foreground))'
    //   : state.isFocused
    //     ? 'hsl(var(--accent-foreground))'
    //     : 'hsl(var(--foreground))'
  })
};
