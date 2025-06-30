import { Label } from '@radix-ui/react-label';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { Loader2, RefreshCw } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';

import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface AsyncSearchSelectProps {
  id: string;
  label: string;
  name: string;
  parametros: Record<string, string>;
  placeholder?: string;
  defaultValue?: Option;
  value?: Option;
  disabled?: boolean;
  onValueChange?: (value: Option | null) => void;
  error?: string;
  withRefresh?: boolean;
  required?: boolean;
}

export const AsyncSearchSelect = forwardRef<React.ComponentRef<typeof AsyncSelect>, AsyncSearchSelectProps>(
  (
    {
      defaultValue,
      disabled = false,
      error,
      id,
      label,
      name,
      onValueChange,
      parametros,
      placeholder = 'Seleccione una opción',
      required = false,
      value,
      withRefresh = true,
    },
    ref
  ) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const prevParamsRef = useRef<string>();
    const api = ApiClient.getInstance();

    // Memoizar el valor actual
    const currentValue = useMemo(() => value || defaultValue, [value, defaultValue]);

    const serializedParams = useMemo(() => JSON.stringify(parametros), [parametros]);

    // Query para cargar opciones
    const { data: queryData, isLoading, refetch } = useQuery({
      enabled: false,
      queryFn: async () => {
        const body = { ...parametros, search: '' };
        const response = await api.post(route('traerFiltros'), body);

        if (!response.success) {
          throw new Error(response.error || 'Error al cargar los datos');
        }

        const data = response.data[0].original;
        if (!Array.isArray(data)) {
          throw new Error('La respuesta no es válida');
        }

        return data.map(r => ({
          label: DOMPurify.sanitize(r.descripcion?.toString() || ''),
          value: DOMPurify.sanitize(r.valor?.toString() || '_empty'),
        }));
      },
      queryKey: ['select-options', parametros],
    });

    // Lógica genérica de fetch según inputValue
    const loadOptions = useCallback(async (inputValue: string): Promise<Option[]> => {
      try {
        const body = { ...parametros, search: inputValue };
        const response = await api.post(route('traerFiltros'), body);

        if (!response.success) {
          throw new Error(response.error || 'Error al cargar los datos');
        }

        const data = response.data[0].original;
        if (!Array.isArray(data)) {
          throw new Error('La respuesta no es válida');
        }

        return data.map(r => ({
          label: DOMPurify.sanitize(r.descripcion?.toString() || ''),
          value: DOMPurify.sanitize(r.valor?.toString() || '_empty'),
        }));
      } catch (err) {
        console.error('Error cargando opciones:', err);
        setErrorMsg('No se pudieron cargar las opciones');
        return [];
      }
    }, [parametros]);

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
          <AsyncSelect
            ref={ref}
            id={id}
            name={name}
            value={currentValue}
            onChange={onValueChange}
            loadOptions={loadOptions}
            defaultOptions={options}
            placeholder={placeholder}
            isDisabled={disabled}
            className="flex-1"
            classNamePrefix="async-select"
            noOptionsMessage={() => "No hay opciones disponibles"}
            loadingMessage={() => "Cargando..."}
            isClearable
          />
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
  }
);

AsyncSearchSelect.displayName = 'AsyncSearchSelect';
