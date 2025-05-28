import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import type { ColumnConfig, TableItem } from '@/types/table';

const api = ApiClient.getInstance();

interface ApiResponse<T> {
  success: boolean;
  error?: string;
  data: T;
}

export const useTableColumns = (tableName: string | undefined, primaryId: string | undefined) => {
  return useQuery({
    queryKey: ['table-columns', tableName],
    queryFn: async () => {
      if (!tableName) throw new Error('Table name is required');

      const response = await api.post<ApiResponse<ColumnConfig[]>>(
        route('schema'),
        { table: tableName }
      );

      if (!response.success) {
        throw new Error(response.error || 'Error loading columns');
      }

      const columns = response.data.data;
      const hasForeignIDs = columns.filter(
        (col: ColumnConfig) => col.nombre && primaryId && col.nombre?.startsWith('id_')
      ).length > 1;

      return { columns, hasForeignIDs };
    },
    enabled: !!tableName,
    staleTime: 5 * 60 * 1000, // 5 minutos para datos de tabla
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};

export const useTableData = (
  tableName: string | undefined,
  primaryId: string | undefined,
  hasMultipleIds: boolean
) => {
  const shouldEnable = Boolean(tableName && primaryId);

  const query = useQuery({
    queryKey: ['table-data', tableName, hasMultipleIds],
    queryFn: async () => {
      if (!tableName) throw new Error('Table name is required');
      if (!primaryId) throw new Error('Primary ID is required');

      const routeToUse = 'get.register.records';
      const params = { renglon: tableName }

      const response = await api.post<ApiResponse<TableItem[]>>(route(routeToUse), params);

      if (!response.success) {
        throw new Error(response.error || 'Error loading data');
      }

      const data = response.data;
      if (!Array.isArray(data)) {
        throw new Error('Invalid data response');
      }

      return data as TableItem[];
    },
    enabled: shouldEnable,
    staleTime: 5 * 60 * 1000, // 5 minutos para datos de tabla
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  return query;
};
