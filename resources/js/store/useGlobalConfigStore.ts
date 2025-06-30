import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserGlobalConfig, UserConfigItem } from '@/types';

import { configSyncService } from '@/services/config-sync-service';

interface GlobalConfigState {
  // Actions
  updateConfig: (config: Partial<UserGlobalConfig>) => void;
  updateConfigItem: (campo: string, valor: string) => void;
  resetConfig: () => void;
  syncWithServer: (serverConfig: UserGlobalConfig) => void;
  syncWithServerItems: (serverConfigItems: UserConfigItem[]) => void;
  forceSync: () => void;
  getConfigValue: (campo: string, defaultValue?: string) => string;
  getConfigValueAsNumber: (campo: string, defaultValue?: number) => number;
  getConfigValueAsBoolean: (campo: string, defaultValue?: boolean) => boolean;
}

// Configuración por defecto (puede ser vacía ya que viene del servidor)
const defaultConfig: UserGlobalConfig = {};

export const useGlobalConfigStore = create<GlobalConfigState & Record<string, string | number | boolean | undefined>>()(
  persist(
    (set, get) => ({
      ...defaultConfig,

      forceSync: () => {
        configSyncService.forceSync();
      },

      getConfigValue: (campo, defaultValue = '') => {
        const state = get();
        return (state[campo] as string) || defaultValue;
      },

      getConfigValueAsBoolean: (campo, defaultValue = false) => {
        const state = get();
        const value = state[campo];
        if (value === undefined || value === null) return defaultValue;
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          return value.toLowerCase() === 'true' || value === '1' || value === 'si';
        }
        return Boolean(value);
      },

      getConfigValueAsNumber: (campo, defaultValue = 0) => {
        const state = get();
        const value = state[campo];
        if (value === undefined || value === null) return defaultValue;
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
      },

      resetConfig: () => {
        set(defaultConfig);
        // Sincronizar reset con el servidor
        configSyncService.updateConfig(defaultConfig);
      },

      syncWithServer: (serverConfig) => {
        set((state) => ({
          ...state,
          ...serverConfig,
        }));
      },

      syncWithServerItems: (serverConfigItems) => {
        const configObject = serverConfigItems.reduce((acc, item) => {
          acc[item.campo] = item.valor;
          return acc;
        }, {} as UserGlobalConfig);

        set((state) => ({
          ...state,
          ...configObject,
        }));
      },

      updateConfig: (newConfig) => {
        set((state) => ({
          ...state,
          ...newConfig,
        }));

        // Sincronizar con el servidor
        configSyncService.updateConfig(newConfig);
      },

      updateConfigItem: (campo, valor) => {
        set((state) => ({
          ...state,
          [campo]: valor,
        }));

        // Sincronizar con el servidor
        configSyncService.updateConfigItem(campo, valor);
      },
    } as GlobalConfigState & Record<string, string | number | boolean | undefined>),
    {
      name: 'user-global-config',
      // Persistir todas las configuraciones excepto las sensibles
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dns_db: _d, nombre_db: _n, ...safeConfig } = state;
        return safeConfig;
      },
    }
  )
); 