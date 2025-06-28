import { useQuery } from '@tanstack/react-query';

import type { DatabaseField } from '@/types/form';

import { ApiClient } from '@/lib/api-client';
import { processField } from '@/lib/utils';

export const useSchemaQuery = (table: string, primaryId: string) => {
  const api = ApiClient.getInstance();

  return useQuery({
    enabled: !!table && !!primaryId,
    gcTime: 60 * 60 * 1000,
    queryFn: async () => {
      const response = await api.get<DatabaseField[]>(route('get.register.fields'), { renglon: table });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Error loading schema');
      }

      return response.data
        .filter((field: DatabaseField) => !['id_usuario', 'fecha_registro', 'fecha_actualizado', 'id_estado'].includes(field.nombre))
        .map((field: DatabaseField) => processField(field, primaryId));
    },
    queryKey: ['schema',table],
    refetchOnMount: true, 
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 30 * 60 * 1000
  });
};
