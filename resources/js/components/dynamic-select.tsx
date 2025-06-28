import { Label } from '@radix-ui/react-label';
import { Check, ChevronsUpDown, Loader2, RefreshCw } from 'lucide-react';
import { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDynamicSelect } from '@/hooks/use-dynamic-select';
import { cn } from '@/lib/utils';

// Tipos mejorados y más específicos
interface SelectOption {
    value: string;
    label: string;
}

interface DependentConfig {
    selectId: string;
    valueKey: string;
}

interface ProcedureConfig {
    name: string;
    params: Record<string, string | ((value: string) => string)>;
}

interface DynamicSelectProps {
    // Props básicas
    id: string;
    name: string;
    label: string;

    // Props de valor
    value?: string;
    defaultValue?: string;
    placeholder?: string;

    // Props de configuración
    parametros?: Record<string, string | SelectOption[]>;
    procedure?: ProcedureConfig;

    // Props de dependencia
    isDependent?: boolean;
    dependentOn?: DependentConfig;

    // Props de comportamiento
    disabled?: boolean;
    required?: boolean;
    withRefresh?: boolean;

    // Props de estilo
    className?: string;
    tabIndex?: number;

    // Props de validación
    error?: string;

    // Callbacks
    onValueChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
}

// Constantes para mejorar la legibilidad
const DEFAULT_PLACEHOLDER = 'Seleccione una opción';
const DEFAULT_REFRESH_ENABLED = true;
const DEFAULT_DEPENDENT = false;

export const DynamicSelect = memo(function DynamicSelect({
    // Props de estilo
    className,
    defaultValue,
    dependentOn,

    // Props de comportamiento
    disabled = false,
    // Props de validación
    error,
    // Props básicas
    id,

    // Props de dependencia
    isDependent = DEFAULT_DEPENDENT,
    label,

    name,
    onOpenChange,

    // Callbacks
    onValueChange,
    // Props de configuración
    parametros = {},
    placeholder = DEFAULT_PLACEHOLDER,

    procedure,
    required = false,

    tabIndex,

    // Props de valor
    value,
    withRefresh = DEFAULT_REFRESH_ENABLED,
}: DynamicSelectProps) {
    // Estado local para controlar la apertura del popover
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [popoverWidth, setPopoverWidth] = useState('auto');
    const triggerRef = useRef<HTMLButtonElement>(null);

    const {
        errorMsg: hookError,
        handleValueChange: handleSelectValueChange,
        isLoading,
        options,
        refetch
    } = useDynamicSelect({
        dependentOn,
        id,
        isDependent,
        parametros,
        placeholder,
        procedure
    });

    // Medir el ancho del trigger para el popover
    useEffect(() => {
        if (triggerRef.current) {
            const width = triggerRef.current.offsetWidth;
            setPopoverWidth(`${width}px`);
        }
    }, [open]);

    // Memoización del valor actual para evitar re-renders innecesarios
    const currentValue = useMemo(() => {
        return value || defaultValue || '';
    }, [value, defaultValue]);

    // Memoización del estado de error combinado
    const combinedError = useMemo(() => {
        return error || hookError;
    }, [error, hookError]);

    // Memoización del estado de deshabilitado
    const isDisabled = useMemo(() => {
        return disabled || isLoading;
    }, [disabled, isLoading]);

    // Encontrar la opción seleccionada
    const selectedOption = useMemo(() => {
        return options.find(option => option.value === currentValue);
    }, [options, currentValue]);

    // Filtrar opciones basado en la búsqueda
    const filteredOptions = useMemo(() => {
        if (!searchValue.trim()) return options;
        
        return options.filter(option => 
            option.label.toLowerCase().includes(searchValue.toLowerCase()) &&
            option.value !== '_empty'
        );
    }, [options, searchValue]);

    // Determinar si mostrar búsqueda (solo si hay más de 10 opciones)
    const shouldShowSearch = useMemo(() => {
        return options.filter(option => option.value !== '_empty').length > 10;
    }, [options]);

    // Callback optimizado para el cambio de valor
    const handleValueChange = useCallback((newValue: string) => {
        handleSelectValueChange(newValue);
        onValueChange?.(newValue);
        setOpen(false);
        setSearchValue(''); // Limpiar búsqueda al seleccionar
    }, [handleSelectValueChange, onValueChange]);

    // Callback optimizado para el cambio de estado abierto/cerrado
    const handleOpenChange = useCallback((open: boolean) => {
        setOpen(open);
        if (!open) {
            setSearchValue(''); // Limpiar búsqueda al cerrar
        }
        onOpenChange?.(open);
    }, [onOpenChange]);

    // Callback optimizado para el botón de refresh
    const handleRefresh = useCallback(async () => {
        if (!isDisabled) {
            try {
                await refetch();
            } catch (error) {
                console.error('Error refreshing select options:', error);
            }
        }
    }, [refetch, isDisabled]);

    // Renderizado condicional del botón de refresh
    const renderRefreshButton = () => {
        if (!withRefresh) return null;

        return (
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="cursor-pointer hover:text-white transition-colors"
                onClick={handleRefresh}
                disabled={isDisabled}
                aria-label="Actualizar opciones"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="h-4 w-4" />
                )}
            </Button>
        );
    };

    // Renderizado condicional del mensaje de error
    const renderErrorMessage = () => {
        if (!combinedError) return null;

        return (
            <p className="text-sm text-red-500 mt-1" role="alert" id={`${id}-error`}>
                {combinedError}
            </p>
        );
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {/* Label */}
            <Label
                htmlFor={id}
                className={cn(
                    "text-sm font-medium",
                    required && "after:content-['*'] after:ml-0.5 after:text-red-500"
                )}
            >
                {label}
            </Label>

            {/* Select Container */}
            <div className="flex gap-2">
                {/* Popover Component */}
                <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="flex-1 justify-between cursor-pointer"
                            disabled={isDisabled}
                            id={id}
                            name={name}
                            aria-label={label}
                            aria-required={required}
                            aria-invalid={!!combinedError}
                            aria-describedby={combinedError ? `${id}-error` : undefined}
                            tabIndex={tabIndex}
                            ref={triggerRef}
                        >
                            {selectedOption ? selectedOption.label : placeholder}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                        className="p-0" 
                        align="start"
                        sideOffset={4}
                        style={{ width: popoverWidth }}
                    >
                        <Command shouldFilter={false}>
                            {shouldShowSearch && (
                                <CommandInput 
                                    placeholder={`Buscar ${label.toLowerCase().replace('*', '')}...`} 
                                    className="h-9"
                                    onValueChange={(search) => {
                                        setSearchValue(search);
                                    }}
                                />
                            )}
                            <CommandList className="max-h-60 overflow-auto">
                                <CommandEmpty>No se encontraron opciones.</CommandEmpty>
                                <CommandGroup>
                                    {filteredOptions
                                        .map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={(currentValue) => {
                                                handleValueChange(currentValue);
                                            }}
                                            className='hover:text-white'
                                            disabled={option.value === '_empty'}
                                        >
                                            {option.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    selectedOption?.value === option.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Refresh Button */}
                {renderRefreshButton()}
            </div>

            {/* Error Message */}
            {renderErrorMessage()}
        </div>
    );
});

// Display name para debugging
DynamicSelect.displayName = 'DynamicSelect';
