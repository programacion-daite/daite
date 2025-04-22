// hooks/useEsquema.ts
import axios from 'axios';
import { procesarCampo } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { CampoBaseDatos } from '@/types/form';

export const useEsquema = (tabla: string, idPrimario: string) => {
  const [campos, setCampos] = useState<CampoBaseDatos[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await axios.get(route('esquema'), { params: { tabla } });
        const camposFiltrados = response.data[0]
          .filter((campo: any) => !['id_usuario', 'fecha_registro', 'fecha_actualizado', 'id_estado'].includes(campo.nombre))
          .map((campo: any) => procesarCampo(campo, idPrimario));

        setCampos(camposFiltrados);
      } catch (e) {
        console.error('Error al cargar esquema:', e);
      }
    };

    cargar();
  }, [tabla, idPrimario]);

  return campos;
};
