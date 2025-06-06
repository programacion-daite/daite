import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import DOMPurify from 'dompurify';
import { Loader2, RefreshCw } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

// Estado global para compartir valores entre selects
const selectValues = new Map<string, string>();

interface DynamicSelectProps {
    id: string;
    label: string;
    name: string;
    defaultValue?: string;
    value?: string;
    parametros?: Record<string, string | { value: string; label: string }[]>;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    withRefresh?: boolean;
    error?: string;
    required?: boolean;
    isDependent?: boolean;
    dependentOn?: {
        selectId: string;
        valueKey: string;
    };
    procedure?: {
        name: string;
        params: {
            [key: string]: string | ((value: string) => string);
        };
    };
    tabIndex?: number;
    className?: string;
}

export const DynamicSelect = memo(function DynamicSelect({
    id,
    label,
    name,
    defaultValue,
    value,
    parametros = {},
    disabled = false,
    onValueChange,
    placeholder = 'Seleccione una opción',
    withRefresh = true,
    error,
    required = false,
    isDependent = false,
    dependentOn,
    procedure,
    tabIndex,
    className,
}: DynamicSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [options, setOptions] = useState<{ value: string; label: string }[]>(() => {
        const optionsParam = parametros.options;
        if (Array.isArray(optionsParam)) {
            return optionsParam;
        }
        if (typeof optionsParam === 'string') {
            try {
                return JSON.parse(optionsParam);
            } catch {
                return optionsParam.split(',').map(opt => {
                    const [value, label] = opt.split(':');
                    return { value, label };
                });
            }
        }
        return [];
    });

    const [errorMsg, setErrorMsg] = useState('');
    const api = ApiClient.getInstance();

    // Manejar el cambio de valor
    const handleValueChange = (newValue: string) => {
        selectValues.set(id, newValue);
        onValueChange?.(newValue);
    };

    // Query para cargar opciones
    const { data: queryData, isLoading, refetch } = useQuery({
        queryKey: ['select-options', id, procedure?.name, selectValues.get(dependentOn?.selectId || '')],
        queryFn: async () => {

            if (isDependent && !dependentOn) {
                throw new Error('Select dependiente debe especificar de qué depende');
            }

            if (!procedure) {
                throw new Error('Debe especificar un procedimiento para cargar las opciones');
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

            const response = await api.post(route('filters.json'), {
                ...procedureParams
            });

            if (!response.success) {
                throw new Error(response.error || 'Error al cargar los datos');
            }
            const data = JSON.parse(response.data[0].json as string);

            if (!Array.isArray(data)) {
                throw new Error('La respuesta no es válida');
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
            }));
        },
        enabled: !isDependent || !!selectValues.get(dependentOn?.selectId || ''),
    });

    useEffect(() => {
        if (queryData) {
            setOptions(queryData);
        }
    }, [queryData]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
        }
        if (isOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault(); // Prevenir el scroll de la página
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
                {label}
            </Label>
            <div className="flex gap-2">
                <Select
                    value={value || defaultValue}
                    onValueChange={handleValueChange}
                    disabled={disabled || isLoading}
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <SelectTrigger
                        id={id}
                        name={name}
                        className="flex-1"
                        aria-label={label}
                        aria-required={required}
                        aria-invalid={!!error}
                        tabIndex={tabIndex}
                        onKeyDown={handleKeyDown}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent
                        position="popper"
                        onCloseAutoFocus={(e) => {
                            e.preventDefault();
                            document.getElementById(id)?.focus();
                        }}
                        onEscapeKeyDown={() => {
                            setIsOpen(false);
                            document.getElementById(id)?.focus();
                        }}
                    >
                        <SelectGroup>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="hover:bg-blue-800 hover:text-white focus:bg-blue-500 focus:text-black cursor-pointer"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {withRefresh && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="cursor-pointer hover:text-white"
                        onClick={() => refetch()}
                        disabled={disabled || isLoading}
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
            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
        </div>
    );
});

DynamicSelect.displayName = 'DynamicSelect';
