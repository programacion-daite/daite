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

      // Obtener los campos y valores como strings separados por comas
      const campos = Object.keys(formDataWithId)
        .filter(key => formDataWithId[key] !== undefined && formDataWithId[key] !== null)
        .join(',');

      const valores = Object.keys(formDataWithId)
        .filter(key => formDataWithId[key] !== undefined && formDataWithId[key] !== null)
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
