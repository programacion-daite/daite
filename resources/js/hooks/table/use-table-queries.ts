import { useQuery } from '@tanstack/react-query';

import type { ColumnConfig, TableItem } from '@/types/table';

import { ApiClient } from '@/lib/api-client';

const api = ApiClient.getInstance();

interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data: T[];
}

interface RawTableResponse {
  resultado: string;
}

interface ParsedTableResponse {
  encabezado: ColumnConfig[];
  datos: TableItem[];
}

interface TableResponse {
  encabezado: ColumnConfig[];
  datos: TableItem[];
  hasForeignIDs: boolean;
}

export const useTableColumns = (tableName: string | undefined, primaryId: string | undefined) => {
  return useQuery({
    enabled: !!tableName,
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
    queryFn: async () => {
      if (!tableName) throw new Error('Table name is required');

      const response = await api.post<ApiResponse<RawTableResponse>>(
        route('get.register.records'),
        { renglon: tableName, salida: 'JSON_CON_ENCABEZADO' }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error loading columns');
      }

      const data = JSON.parse(response.data[0].resultado) as ParsedTableResponse;

      return { encabezado: data.encabezado };
    },
    queryKey: ['table-columns', tableName],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity // Las columnas nunca cambian
  });
};

export const useTableData = (
  tableName: string | undefined,
  primaryId: string | undefined,
  skipColumns: boolean = false,
  initialData?: TableItem[]
) => {
  const query = useQuery({
    enabled: Boolean(tableName && primaryId),
    gcTime: 5 * 60 * 1000,
    initialData,
    queryFn: async () => {
      if (!tableName || !primaryId) {
        if (initialData) return initialData;
        throw new Error('Table name and primary ID are required');
      }

      const response = await api.post<ApiResponse<TableResponse>>(route('get.register.records'), {
        renglon: tableName,
        salida: 'JSON_SIN_ENCABEZADO',
        skipColumns
      });

      if (!response.success) throw new Error(response.error || 'Error loading data');

      if (!response.data[0]?.resultado) {
        console.error('useTableData - no resultado found in response');
        throw new Error('No resultado found in response');
      }

      try {
        const data = JSON.parse(response.data[0].resultado) as TableResponse;

        if (!data.datos || !Array.isArray(data.datos)) {
          console.error('useTableData - invalid datos:', data.datos);
          throw new Error('Invalid data response');
        }

        return data.datos;
      } catch (error) {
        console.error('useTableData - JSON parse error:', error);
        console.error('useTableData - raw resultado:', response.data[0].resultado);
        throw new Error('Error parsing JSON response');
      }
    },
    queryKey: ['table-data', tableName, skipColumns],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0
  });

  return query;
};


// Nuevo hook combinado para la carga inicial
export const useInitialTableLoad = (tableName: string | undefined, primaryId: string | undefined) => {
  return useQuery({
    enabled: Boolean(tableName && primaryId),
    gcTime: 5 * 60 * 1000, // 5 minutos
    queryFn: async () => {
      if (!tableName) throw new Error('Table name is required');
      if (!primaryId) throw new Error('Primary ID is required');

      const response = await api.post<ApiResponse<RawTableResponse>>(
        route('get.register.records'),
        { renglon: tableName, salida: 'JSON_CON_ENCABEZADO' }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error loading table data');
      }

      if (!response.data[0]?.resultado) {
        console.error('useInitialTableLoad - no resultado found in response');
        throw new Error('No resultado found in response');
      }

      try {
        const data = JSON.parse(response.data[0].resultado) as ParsedTableResponse;

        return {
          datos: data.datos || [],
          encabezado: data.encabezado || []
        };
      } catch (error) {
        console.error('useInitialTableLoad - JSON parse error:', error);
        throw new Error('Error parsing JSON response');
      }
    },
    queryKey: ['initial-table-load', tableName],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0
  });
};
