import { forwardRef, useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface AsyncSearchSelectProps {
  parametros: Record<string, string>;
  placeholder?: string;
  defaultValue?: Option;
  onChange: (opt: Option | null) => void;
  error?: boolean;
  withRefresh?: boolean;        // <— habilita/deshabilita el botón
}

export const AsyncSearchSelect = forwardRef<any, AsyncSearchSelectProps>(
  (
    {
      parametros,
      placeholder,
      defaultValue,
      onChange,
      error,
      withRefresh = true,
    },
    ref
  ) => {
    // Opciones “por defecto” que aparecerán al abrir el menú
    const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);
    const [loadingDefault, setLoadingDefault] = useState(false);

    // Lógica genérica de fetch según inputValue
    const loadOptions = async (inputValue: string): Promise<Option[]> => {
      const body = { ...parametros, search: inputValue };
      const resp = await axios.post(route('traerFiltros'), body, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const raw = (resp.data[0].original as Array<{ valor: string; descripcion: string }>);

      return raw.map(r => ({
        value: r.valor,
        label: r.descripcion,
      }));
    };

    // Fetch inicial y al “refresh”
    const fetchDefaultOptions = async () => {
      setLoadingDefault(true);
      try {
        const opts = await loadOptions('');   // carga sin filtro
        setDefaultOptions(opts);
      } catch (e) {
        console.error('Error cargando defaultOptions', e);
      }
      setLoadingDefault(false);
    };

    // carga inicial (y si cambia `parametros`)
    useEffect(() => {
      fetchDefaultOptions();
    }, [JSON.stringify(parametros)]);

    return (
      <div className="flex items-center gap-2 w-full">
        <AsyncSelect
          ref={ref}
          cacheOptions
          defaultOptions={defaultOptions}
          loadOptions={loadOptions}
          defaultValue={defaultValue}
          onChange={onChange}
          isClearable
          unstyled
          classNames={{
            control: ({ isFocused }) =>
              cn(
                'flex w-full !min-h-0 rounded-md border border-input bg-background px-3 py-[3px] text-sm shadow-sm transition-colors',
                'placeholder:text-muted-foreground focus-visible:outline-none',
                isFocused && 'ring-1 ring-ring',
                error && 'border-destructive ring-destructive',
              ),
            placeholder: () => 'text-muted-foreground',
            input: () => 'text-sm',
            menu: () => 'mt-2 rounded-md border bg-popover text-popover-foreground shadow-md py-1',
            menuList: () => 'text-sm max-h-60 overflow-auto',
            option: ({ isFocused, isSelected }) =>
              cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none transition-colors',
                isSelected && 'bg-primary text-primary-foreground',
                isFocused && !isSelected && 'bg-accent text-accent-foreground',
                !isFocused && !isSelected && 'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
              ),
            noOptionsMessage: () => 'text-muted-foreground p-2 text-sm',
            clearIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
            dropdownIndicator: () => 'p-1 text-muted-foreground hover:text-foreground',
            indicatorSeparator: () => 'bg-input mx-2 my-2 w-[1px]',
          }}
          placeholder={placeholder}
        />

        {withRefresh && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="bg-primary"
            onClick={fetchDefaultOptions}
            disabled={loadingDefault}
          >
            {loadingDefault
              ? <Loader2 className="h-4 w-4 animate-spin text-white" />
              : <RefreshCw className="h-4 w-4 text-white" />
            }
          </Button>
        )}
      </div>
    );
  }
);

AsyncSearchSelect.displayName = 'AsyncSearchSelect';
