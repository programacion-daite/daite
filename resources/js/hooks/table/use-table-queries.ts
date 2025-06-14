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
  hasMultipleIds: boolean,
  skipColumns: boolean = false // Nuevo parámetro para indicar si queremos solo los datos
) => {
  const shouldEnable = Boolean(tableName && primaryId);

  const query = useQuery({
    queryKey: ['table-data', tableName, hasMultipleIds, skipColumns],
    queryFn: async () => {
      if (!tableName) throw new Error('Table name is required');
      if (!primaryId) throw new Error('Primary ID is required');

      const routeToUse = 'get.register.records';
      const params = {
        renglon: tableName,
        skipColumns,
        salida: 'JSON_SIN_ENCABEZADO'
      }

      const response = await api.post<ApiResponse<TableResponse>>(route(routeToUse), params);

      if (!response.success) {
        throw new Error(response.error || 'Error loading data');
      }

      const data = JSON.parse(response.data[0].resultado) as TableResponse;

      if (!data.datos || !Array.isArray(data.datos)) {
        throw new Error('Invalid data response');
      }

      return data.datos as TableItem[];
    },
    enabled: shouldEnable,
    staleTime: 0, // Los datos siempre se consideran stale para poder actualizarlos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  return query;
};
