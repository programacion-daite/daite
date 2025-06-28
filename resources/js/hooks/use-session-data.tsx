import { usePage } from '@inertiajs/react';

import type { SharedData } from '@/types';

// Hook para módulos del usuario
export function useUserModules() {
  const { props } = usePage<SharedData>();
  return props.userModules || [];
}

// Hook para programas del usuario
export function useUserPrograms() {
  const { props } = usePage<SharedData>();
  return props.userPrograms || {
    favoritos: [],
    genericos: [],
    procesos: {},
    registros: {},
    reportes: {}
  };
}

// Hook para datos de la empresa
export function useCompanyData() {
  const { props } = usePage<SharedData>();
  return props.companyData || {};
}

// Hook para rutas de la aplicación
export function useApplicationRoutes() {
  const { props } = usePage<SharedData>();
  return props.applicationRoutes || [];
}

// Hook para programas de un tipo específico
export function useProgramsByType(type: 'registros' | 'procesos' | 'reportes') {
  const { props } = usePage<SharedData>();
  return props.userPrograms?.[type] || {};
}

// Hook para programas favoritos
export function useFavoritePrograms() {
  const { props } = usePage<SharedData>();
  return props.userPrograms?.favoritos || [];
}

// Hook para programas genéricos
export function useGenericPrograms() {
  const { props } = usePage<SharedData>();
  return props.userPrograms?.genericos || [];
}

// Hook para programas de un módulo específico
export function useProgramsByModule(moduleId: string, type: 'registros' | 'procesos' | 'reportes' = 'registros') {
  const { props } = usePage<SharedData>();
  return props.userPrograms?.[type]?.[moduleId] || [];
}

// Hook para verificar si una ruta está disponible
export function useRouteAvailable(routeName: string) {
  const { props } = usePage<SharedData>();
  return props.applicationRoutes?.includes(routeName) || false;
}

// Hook para obtener módulos por referencia
export function useModulesByReference(reference: string) {
  const { props } = usePage<SharedData>();
  return props.userModules?.filter(module => module.referencia === reference) || [];
} 