import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import DOMPurify from 'dompurify';
import { Loader2, RefreshCw } from 'lucide-react';
import { memo, useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface DynamicSelectProps {
    id: string;
    label: string;
    name: string;
    defaultValue?: string;
    value?: string;
    parametros?: Record<string, string>;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    withRefresh?: boolean;
    error?: string;
    required?: boolean;
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
}: DynamicSelectProps) {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const prevParamsRef = useRef<string>();
    const api = ApiClient.getInstance();

    // Memoizar los parámetros serializados
    const serializedParams = useMemo(() => JSON.stringify(parametros), [parametros]);

    // Query para cargar opciones
    const { data: queryData, isLoading, refetch } = useQuery({
        queryKey: ['select-options', parametros],
        queryFn: async () => {
            const response = await api.post(route('traerFiltros'), parametros);

            if (!response.success) {
                throw new Error(response.error || 'Error al cargar los datos');
            }

            const data = response.data[0].original;
            if (!Array.isArray(data)) {
                throw new Error('La respuesta no es válida');
            }

            return data.map(r => ({
                value: DOMPurify.sanitize(r.valor?.toString() || '_empty'),
                label: DOMPurify.sanitize(r.descripcion?.toString() || ''),
            }));
        },
        enabled: false, // No cargar automáticamente
    });

    // Actualizar opciones cuando cambian los parámetros
    useEffect(() => {
        if (serializedParams !== prevParamsRef.current) {
            prevParamsRef.current = serializedParams;
            refetch();
        }
    }, [serializedParams, refetch]);

    // Actualizar opciones cuando cambia queryData
    useEffect(() => {
        if (queryData) {
            setOptions(queryData);
        }
    }, [queryData]);

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id} className={cn("text-sm font-medium", required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
                {label}
            </Label>
            <div className="flex gap-2">
                <Select
                    value={value || defaultValue}
                    onValueChange={onValueChange}
                    disabled={disabled || isLoading}
                >
                    <SelectTrigger id={id} name={name} className="flex-1">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
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
