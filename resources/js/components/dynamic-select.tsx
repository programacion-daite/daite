import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Loader2, RefreshCw } from 'lucide-react';
import { memo, useCallback, useEffect, useState, useMemo, useRef } from 'react';

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

export const DynamicSelect = memo(
    ({
        id,
        label,
        defaultValue = '',
        value = '',
        parametros = {},
        disabled = false,
        onValueChange,
        placeholder = '',
        withRefresh = true,
    }: DynamicSelectProps) => {
        const [options, setOptions] = useState<{ valor: string; descripcion: string }[]>([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const prevParamsRef = useRef<string>();

        // Memoizar el valor actual
        const currentValue = useMemo(() => value || defaultValue, [value, defaultValue]);

        // Memoizar los parámetros serializados
        const serializedParams = useMemo(() => JSON.stringify(parametros), [parametros]);

        const fetchOptions = useCallback(async () => {
            // Evitar fetchs duplicados con los mismos parámetros
            if (prevParamsRef.current === serializedParams && options.length > 0) {
                return;
            }

            setLoading(true);
            setError('');

            try {
                const body = {
                    ...parametros,
                };

                const response = await axios.post(route('traerOpciones'), body, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (response.status !== 200) throw new Error('Error al cargar los datos');

                const data = body?.isGeneric ? response.data[0].original[0].original : response.data[0];

                if (!Array.isArray(data)) {
                    throw new Error('La respuesta no es válida');
                }

                // Sanitize and set options
                const sanitized = data.map((registro) => ({
                    valor: DOMPurify.sanitize(registro.valor?.toString() || '_empty'),
                    descripcion: DOMPurify.sanitize(registro.descripcion?.toString() || ''),
                }));

                setOptions(sanitized);
                prevParamsRef.current = serializedParams;
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las opciones');
            }

            setLoading(false);
        }, [serializedParams, options.length, parametros]);

        // Efecto para cargar opciones iniciales
        useEffect(() => {
            fetchOptions();
        }, [serializedParams, fetchOptions]);

        // Memoizar el manejador de cambios
        const handleChange = useCallback((newValue: string) => {
            if (onValueChange) {
                onValueChange(newValue);
            }
        }, [onValueChange]);

        // Memoizar las opciones renderizadas
        const renderedOptions = useMemo(() =>
            options.map((opt) => (
                <SelectItem
                    key={opt.valor}
                    value={opt.valor}
                    className="min-h-[2rem] focus:text-white"
                >
                    {opt.descripcion}
                </SelectItem>
            ))
        , [options]);

        return (
            <div className="input-label w-full">
                <Label htmlFor={id}>{label}</Label>
                <div className="flex items-center gap-2">
                    <Select
                        value={currentValue}
                        onValueChange={handleChange}
                        disabled={disabled || loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {renderedOptions}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {withRefresh && (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="bg-primary"
                            onClick={fetchOptions}
                            disabled={loading}
                        >
                            {loading ?
                                <Loader2 className="h-4 w-4 animate-spin text-white" /> :
                                <RefreshCw className="h-4 w-4 text-white" />
                            }
                        </Button>
                    )}
                </div>

                {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
            </div>
        );
    }
);

DynamicSelect.displayName = 'DynamicSelect';
