import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from './api-client';
import { FormDataType } from '@/types/form';

const api = ApiClient.getInstance();

export const useCreateMutation = <T>(endpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await api.post<T>(endpoint, data);
      if (!response.success) {
        throw new Error(response.error || 'Error creating record');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};

export const useUpdateMutation = <T>(endpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Record<string, unknown> }) => {
      const response = await api.put<T>(`${endpoint}/${id}`, data);
      if (!response.success) {
        throw new Error(response.error || 'Error updating record');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};

export const useDeleteMutation = (endpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`${endpoint}/${id}`);
      if (!response.success) {
        throw new Error(response.error || 'Error deleting record');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });
};

export const useRegisterRecordsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ table, primaryId, formData }: {
      table: string;
      primaryId: string;
      formData: FormDataType;
    }) => {
      // Preparar los datos del formulario incluyendo el ID primario
      const formDataWithId = {
        [primaryId]: formData[primaryId] ?? 0, // Usar el ID existente o 0 si no existe
        ...formData
      };

      // Obtener el nombre descriptivo de la tabla principal (sin el prefijo id_)
      const nombreDescriptivo = primaryId.replace('id_', '');

      // Identificar campos foráneos (excluyendo la tabla principal)
      const camposForaneos = Object.keys(formDataWithId).filter(
        campo => !campo.startsWith('id_') &&
                formDataWithId[`id_${campo}`] &&
                campo !== nombreDescriptivo
      );

      // Filtrar los campos
      const campos = Object.keys(formDataWithId)
        .filter(key => {
          // Excluir campos undefined o null
          if (formDataWithId[key] === undefined || formDataWithId[key] === null) {
            return false;
          }
          // Excluir campos descriptivos de foráneos (excepto el de la tabla principal)
          if (camposForaneos.includes(key)) {
            return false;
          }
          return true;
        })
        .join(',');

      const valores = Object.keys(formDataWithId)
        .filter(key => {
          // Excluir campos undefined o null
          if (formDataWithId[key] === undefined || formDataWithId[key] === null) {
            return false;
          }
          // Excluir campos descriptivos de foráneos (excepto el de la tabla principal)
          if (camposForaneos.includes(key)) {
            return false;
          }
          return true;
        })
        .map(key => formDataWithId[key]?.toString().toUpperCase())
        .join(',');

      // Preparar el payload para la API
      const payload = {
        json: JSON.stringify({
          tabla: table,
          campos: campos,
          valores: valores
        })
      };

      // Realizar la petición
      const response = await api.post('register-records', payload);

      if (!response.success) {
        throw new Error(response.error || 'Error registering records');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['register-records'] });
    },
  });
};
