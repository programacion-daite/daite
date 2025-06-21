import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import type { ColumnConfig, TableItem } from '@/types/table';

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
    queryKey: ['table-columns', tableName],
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
    enabled: !!tableName,
    staleTime: Infinity, // Las columnas nunca cambian
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};

export const useTableData = (
  tableName: string | undefined,
  primaryId: string | undefined,
  skipColumns: boolean = false,
  initialData?: TableItem[]
) => {
  const query = useQuery({
    queryKey: ['table-data', tableName, skipColumns],
    queryFn: async () => {
      if (!tableName || !primaryId) {
        if (initialData) return initialData;
        throw new Error('Table name and primary ID are required');
      }

      const response = await api.post<ApiResponse<TableResponse>>(route('get.register.records'), {
        renglon: tableName,
        skipColumns,
        salida: 'JSON_SIN_ENCABEZADO'
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
    enabled: Boolean(tableName && primaryId),
    initialData,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  return query;
};


// Nuevo hook combinado para la carga inicial
export const useInitialTableLoad = (tableName: string | undefined, primaryId: string | undefined) => {
  return useQuery({
    queryKey: ['initial-table-load', tableName],
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
          encabezado: data.encabezado || [],
          datos: data.datos || []
        };
      } catch (error) {
        console.error('useInitialTableLoad - JSON parse error:', error);
        throw new Error('Error parsing JSON response');
      }
    },
    enabled: Boolean(tableName && primaryId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};
