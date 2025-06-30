import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import type { SharedData, UserGlobalConfig, UserConfigItem } from '@/types';

import { useGlobalConfigStore } from '@/store/useGlobalConfigStore';

export function useGlobalConfig() {
  const { props } = usePage<SharedData>();
  const { 
    getConfigValue, 
    getConfigValueAsBoolean, 
    getConfigValueAsNumber, 
    syncWithServer,
    syncWithServerItems,
    updateConfig,
    updateConfigItem,
    ...configState 
  } = useGlobalConfigStore();

  // Sincronizar configuraciones del servidor al cargar la página
  useEffect(() => {
    if (props.userGlobalConfig) {
      // Si viene como array de items
      if (Array.isArray(props.userGlobalConfig)) {
        syncWithServerItems(props.userGlobalConfig as UserConfigItem[]);
      } 
      // Si viene como objeto
      else {
        syncWithServer(props.userGlobalConfig as UserGlobalConfig);
      }
    }
  }, [props.userGlobalConfig, syncWithServer, syncWithServerItems]);

  return {
    ...configState,
    getConfigValue,
    getConfigValueAsBoolean,
    getConfigValueAsNumber,
    updateConfig,
    updateConfigItem,
  };
}

// Hook específico para configuraciones de tabla
export function useTableConfig() {
  const { 
    getConfigValueAsNumber, 
    updateConfigItem 
  } = useGlobalConfig();
  
  return {
    defaultPageSize: getConfigValueAsNumber('cantidad_registros_mostrar_busqueda_selector', 10),
    updateTableConfig: (campo: string, valor: string) => {
      updateConfigItem(campo, valor);
    },
    visiblePageSize: getConfigValueAsNumber('cantidad_registros_visible_selector', 10),
  };
}

// Hook específico para configuraciones de UI
export function useUIConfig() {
  const { 
    getConfigValue, 
    getConfigValueAsBoolean, 
    getConfigValueAsNumber,
    updateConfigItem 
  } = useGlobalConfig();
  
  return {
    buttonColor: getConfigValue('color_boton', '#005cac'),
    buttonHeight: getConfigValueAsNumber('altura_boton', 65),
    buttonTextColor: getConfigValue('color_texto_boton', '#ffffff'),
    // Botones
    buttonWidth: getConfigValueAsNumber('ancho_boton', 150),
    
    // Cantidad de registros mostrar busqueda de opciones
    defaultSearchResultsMinimum: getConfigValueAsNumber('cantidad_registros_mostrar_busqueda_selector', 10),
    
    // Cliente Daite
    isDaiteClient: getConfigValueAsBoolean('cliente_daite', false),
    
    // Comportamiento
    openCashBreakdown: getConfigValueAsBoolean('abrir_desglose_efectivo', true),

    // Mensajes
    saveMessage: getConfigValue('mensaje_guardar', 'Guardado con éxito'),
    
    updateUIConfig: (campo: string, valor: string) => {
      updateConfigItem(campo, valor);
    },
  };
}

// Hook específico para configuraciones de base de datos
export function useDatabaseConfig() {
  const { 
    getConfigValue, 
    updateConfigItem 
  } = useGlobalConfig();
  
  return {
    databaseDNS: getConfigValue('dns_db', ''),
    databaseMode: getConfigValue('modalidad_db', 'b'),
    databaseName: getConfigValue('nombre_db', ''),
    dataStartDate: getConfigValue('fecha_inicio_datos', ''),
    defaultCalculationType: getConfigValue('tipo_calculo_defecto', '1'),
    
    updateDatabaseConfig: (campo: string, valor: string) => {
      updateConfigItem(campo, valor);
    },
  };
}

// Hook específico para configuraciones de notificaciones
export function useNotificationConfig() {
  const { 
    getConfigValue, 
    updateConfigItem 
  } = useGlobalConfig();
  
  return {
    followUpEmails: getConfigValue('correos_enviar_copias_seguimientos', ''),
    
    updateNotificationConfig: (campo: string, valor: string) => {
      updateConfigItem(campo, valor);
    },
  };
}

// Hook específico para configuraciones de búsqueda
export function useSearchConfig() {
  const { searchDebounceMs, searchResultsLimit, updateConfig } = useGlobalConfig();
  
  return {
    debounceMs: searchDebounceMs,
    resultsLimit: searchResultsLimit,
    updateSearchConfig: (config: Partial<Pick<UserGlobalConfig, 'searchResultsLimit' | 'searchDebounceMs'>>) => {
      updateConfig(config);
    },
  };
}

// Hook específico para configuraciones de usuario
export function useUserConfig() {
  const { defaultCobrador, defaultSucursal, updateConfig } = useGlobalConfig();
  
  return {
    defaultCobrador,
    defaultSucursal,
    updateUserConfig: (config: Partial<Pick<UserGlobalConfig, 'defaultCobrador' | 'defaultSucursal'>>) => {
      updateConfig(config);
    },
  };
} 