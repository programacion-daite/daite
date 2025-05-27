// hooks/useSchema.ts
import { processField } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { DatabaseField } from '@/types/form';
import { ApiClient } from '@/lib/api-client';

export const useSchema = (table: string, primaryId: string) => {
  const [fields, setFields] = useState<DatabaseField[]>([]);
  const api = ApiClient.getInstance();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<{ data: DatabaseField[] }>(route('schema'), { table });

        if (response.success && response.data) {
          const filteredFields = response.data.data
            .filter((field: DatabaseField) => !['id_usuario', 'fecha_registro', 'fecha_actualizado', 'id_estado'].includes(field.nombre))
            .map((field: DatabaseField) => processField(field, primaryId));

          setFields(filteredFields);
        } else {
          console.error('Error loading schema:', response.error);
        }
      } catch (e) {
        console.error('Error loading schema:', e);
      }
    };

    load();
  }, [table, primaryId]);

  return fields;
};
