import { useQuery } from '@tanstack/react-query';
import { processField } from '@/lib/utils';
import type { DatabaseField } from '@/types/form';
import { ApiClient } from '@/lib/api-client';

export const useSchemaQuery = (table: string, primaryId: string) => {
  const api = ApiClient.getInstance();

  return useQuery({
    queryKey: ['schema',table],
    queryFn: async () => {
      const response = await api.get<DatabaseField[]>(route('get.register.fields'), { renglon: table });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Error loading schema');
      }

      return response.data
        .filter((field: DatabaseField) => !['id_usuario', 'fecha_registro', 'fecha_actualizado', 'id_estado'].includes(field.nombre))
        .map((field: DatabaseField) => processField(field, primaryId));
    },
    enabled: !!table && !!primaryId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000, 
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};
