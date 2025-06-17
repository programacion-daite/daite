import { memo, useCallback, useState } from 'react';
import Select, { components, GroupBase, OptionProps } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { ErrorHandler } from '@/services/error-handler';
import { ApiResponse } from '@/types/errors';
import DOMPurify from 'dompurify';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomSelectProps {
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
    minimumResultsForSearch?: number;
    maxHeight?: number;
}

const selectValues = new Map<string, string>();

const CustomOption = ({ children, ...props }: OptionProps<any, boolean, GroupBase<any>>) => {
    return (
        <components.Option {...props}>
            <div className="flex items-center gap-2">
                {props.isSelected && <span className="text-primary">✓</span>}
                <span>{children}</span>
            </div>
        </components.Option>
    );
};

export const CustomSelect = memo(function CustomSelect({
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
    minimumResultsForSearch = 10,
    maxHeight = 300,
}: CustomSelectProps) {
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

    const handleChange = useCallback((selectedOption: any) => {
        const newValue = selectedOption?.value || '';
        selectValues.set(id, newValue);
        onValueChange?.(newValue);
    }, [id, onValueChange]);

    const handleRefresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex gap-2">
                <div className="flex-1">
                    <Select
                        id={id}
                        name={name}
                        value={options?.find(opt => opt.value === (value || defaultValue))}
                        onChange={handleChange}
                        options={options}
                        placeholder={placeholder}
                        isDisabled={disabled || isLoading}
                        isClearable={!required}
                        isSearchable={true}
                        components={{ Option: CustomOption }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        noOptionsMessage={() => "No hay opciones disponibles"}
                        loadingMessage={() => "Cargando..."}
                        menuPlacement="auto"
                        maxMenuHeight={maxHeight}
                        minMenuHeight={100}
                        menuPortalTarget={document.body}
                        styles={{
                            control: (base) => ({
                                ...base,
                                minHeight: '38px',
                                borderColor: error ? 'rgb(239, 68, 68)' : base.borderColor,
                                '&:hover': {
                                    borderColor: error ? 'rgb(239, 68, 68)' : base.borderColor,
                                },
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                                width: '100%',
                                minWidth: '100%',
                            }),
                            menuList: (base) => ({
                                ...base,
                                width: '100%',
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                width: '100%',
                            }),
                        }}
                    />
                </div>
                {withRefresh && (
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={disabled || isLoading}
                        className="flex items-center justify-center w-10 h-10 border rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
});

CustomSelect.displayName = 'CustomSelect';
