import { memo, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { ErrorHandler } from '@/services/error-handler';
import { ApiResponse } from '@/types/errors';
import DOMPurify from 'dompurify';
import { Loader2, RefreshCw, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface CustomComboboxProps {
    id: string;
    name: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    className?: string;
    procedure?: {
        name: string;
        params: {
            [key: string]: string | ((value: string) => string);
        };
    };
    isDependent?: boolean;
    dependentOn?: {
        selectId: string;
        valueKey: string;
    };
    onValueChange?: (value: string) => void;
    withRefresh?: boolean;
    searchable?: boolean;
    maxHeight?: number;
}

const selectValues = new Map<string, string>();

export const CustomCombobox = memo(function CustomCombobox({
    id,
    name,
    value,
    defaultValue,
    placeholder = 'Seleccione una opción',
    disabled = false,
    required = false,
    error,
    className,
    procedure,
    isDependent = false,
    dependentOn,
    onValueChange,
    withRefresh = true,
    searchable = true,
    maxHeight = 300,
}: CustomComboboxProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const api = ApiClient.getInstance();
    const errorHandler = ErrorHandler.getInstance();

    const { data: options, refetch } = useQuery({
        queryKey: ['select-options', id, procedure?.name, selectValues.get(dependentOn?.selectId || '')],
        queryFn: async () => {
            try {
                setIsLoading(true);

                if (isDependent && !dependentOn) {
                    console.log('Select dependiente debe especificar de qué depende');
                    return [];
                }

                if (!procedure) {
                    console.log('No se especificó un procedimiento para cargar las opciones');
                    return [];
                }

                const procedureParams: Record<string, string> = {};
                for (const [key, value] of Object.entries(procedure.params)) {
                    if (typeof value === 'function') {
                        const dependentValue = selectValues.get(dependentOn?.selectId || '') || '';
                        procedureParams[key] = value(dependentValue);
                    } else {
                        procedureParams[key] = value;
                    }
                }

                const response = await api.post<ApiResponse<Array<{ json: string }>>>(route('filters.json'), {
                    ...procedureParams
                });

                if (!response.success) {
                    throw errorHandler.createApiError(
                        typeof response.error === 'string' ? response.error : 'Error al cargar los datos'
                    );
                }

                if (!response.data?.[0]?.json) {
                    throw errorHandler.createValidationError('La respuesta no contiene datos válidos');
                }

                const data = JSON.parse(response.data[0].json);

                if (!Array.isArray(data)) {
                    throw errorHandler.createValidationError('La respuesta no es válida');
                }

                if (data.length === 0) {
                    return [{
                        value: '',
                        label: placeholder || 'No hay opciones'
                    }];
                }

                return data.map(r => ({
                    value: DOMPurify.sanitize(r.valor?.toString() || '_empty'),
                    label: DOMPurify.sanitize(r.descripcion?.toString() || ''),
                    ...r
                }));
            } catch (error) {
                const appError = errorHandler.handleError(error);
                console.log(appError);
                throw appError;
            } finally {
                setIsLoading(false);
            }
        },
        enabled: !isDependent || !!selectValues.get(dependentOn?.selectId || ''),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const handleValueChange = useCallback((newValue: string) => {
        selectValues.set(id, newValue);
        onValueChange?.(newValue);
        setOpen(false);
    }, [id, onValueChange]);

    const handleRefresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    const selectedOption = options?.find(opt => opt.value === (value || defaultValue));

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                "w-full justify-between",
                                error && "border-red-500",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={disabled || isLoading}
                        >
                            {selectedOption ? selectedOption.label : placeholder}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" style={{ maxHeight: `${maxHeight}px` }}>
                        <Command>
                            {searchable && (
                                <CommandInput placeholder="Buscar..." />
                            )}
                            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                            <CommandGroup>
                                {options?.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={handleValueChange}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedOption?.value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {withRefresh && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={disabled || isLoading}
                        className="shrink-0"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
});

CustomCombobox.displayName = 'CustomCombobox';
