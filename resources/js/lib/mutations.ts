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
      const formDataWithId = {
        [primaryId]: formData[primaryId] ?? 0,
        ...formData
      };

      const descriptiveName = primaryId.replace('id_', '');

      const foreignFields = Object.keys(formDataWithId).filter(
        field => !field.startsWith('id_') &&
                formDataWithId[`id_${field}`] &&
                field !== descriptiveName
      );

      const fields = Object.keys(formDataWithId)
        .filter(key => {
          if (formDataWithId[key] === undefined || formDataWithId[key] === null) {
            return false;
          }
          if (foreignFields.includes(key)) {
            return false;
          }
          return true;
        })
        .join(',');

      const values = Object.keys(formDataWithId)
        .filter(key => {
          if (formDataWithId[key] === undefined || formDataWithId[key] === null) {
            return false;
          }
          if (foreignFields.includes(key)) {
            return false;
          }
          return true;
        })
        .map(key => formDataWithId[key]?.toString().replaceAll(',','').toUpperCase())
        .join(',');

      const payload = {
        json: JSON.stringify({
          tabla: table,
          campos: fields,
          valores: values
        })
      };

      const response = await api.post('register-records', payload);

      if (!response.success) {
        return response;
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['register-records'] });
    },
  });
};
