// resources/js/lib/api.ts
import { ApiClient } from './api-client';

export async function fetchSingleEntity(informId: string) {
  const api = ApiClient.getInstance();
  const res = await api.post<any[]>('single-entity', {
    id_renglon: informId,
    renglon: 'INFORME',
  });
  if (!res.success) throw new Error(res.error || 'Error al obtener detalles');
  return res.data;
}

export async function fetchDatos(informId: string) {
  const api = ApiClient.getInstance();
  const res = await api.post<any[]>('get-inform', {
    id_informe: informId,
  });
  if (!res.success) throw new Error(res.error || 'Error al obtener datos');
  return res.data;
}