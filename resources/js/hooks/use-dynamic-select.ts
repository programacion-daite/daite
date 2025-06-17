import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { ErrorHandler } from '@/services/error-handler';
import { ApiResponse } from '@/types/errors';
import DOMPurify from 'dompurify';

const selectValues = new Map<string, string>();

interface UseDynamicSelectProps {
    id: string;
    parametros?: Record<string, string | { value: string; label: string }[]>;
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
    placeholder?: string;
}

interface UseDynamicSelectReturn {
    options: { value: string; label: string }[];
    isLoading: boolean;
    errorMsg: string;
    handleValueChange: (value: string) => void;
    refetch: () => Promise<unknown>;
}

export function useDynamicSelect({
    id,
    parametros = {},
    isDependent = false,
    dependentOn,
    procedure,
    placeholder = 'Seleccione una opción',
}: UseDynamicSelectProps): UseDynamicSelectReturn {
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
    const errorHandler = ErrorHandler.getInstance();

    const handleValueChange = (newValue: string) => {
        selectValues.set(id, newValue);
    };

    const { data: queryData, isLoading, refetch } = useQuery({
        queryKey: ['select-options', id, procedure?.name, selectValues.get(dependentOn?.selectId || '')],
        queryFn: async () => {
            try {
                if (isDependent && !dependentOn) {
                    console.log('Select dependiente debe especificar de qué depende');
                }

                if (!procedure) {
                    console.log('No se especificó un procedimiento para cargar las opciones');
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
                }));
            } catch (error) {
                const appError = errorHandler.handleError(error);
                console.log(appError);
                throw appError;
            }
        },
        enabled: !isDependent || !!selectValues.get(dependentOn?.selectId || ''),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    useEffect(() => {
        if (queryData) {
            setOptions(queryData);
        }
    }, [queryData]);

    return {
        options,
        isLoading,
        errorMsg,
        handleValueChange,
        refetch,
    };
}
