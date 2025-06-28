import { router } from '@inertiajs/react';

import type { UserGlobalConfig } from '@/types';

class ConfigSyncService {
  private static instance: ConfigSyncService;
  private syncTimeout: NodeJS.Timeout | null = null;
  private pendingChanges: Partial<UserGlobalConfig> = {};

  private constructor() {}

  static getInstance(): ConfigSyncService {
    if (!ConfigSyncService.instance) {
      ConfigSyncService.instance = new ConfigSyncService();
    }
    return ConfigSyncService.instance;
  }

  /**
   * Actualiza una configuración y programa la sincronización con el servidor
   */
  updateConfig(config: Partial<UserGlobalConfig>): void {
    // Acumular cambios
    this.pendingChanges = { ...this.pendingChanges, ...config };

    // Cancelar sincronización anterior si existe
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    // Programar nueva sincronización (debounce de 2 segundos)
    this.syncTimeout = setTimeout(() => {
      this.syncWithServer();
    }, 2000);
  }

  /**
   * Actualiza un item específico de configuración
   */
  updateConfigItem(campo: string, valor: string): void {
    this.updateConfig({ [campo]: valor });
  }

  /**
   * Sincroniza inmediatamente con el servidor
   */
  syncWithServer(): void {
    if (Object.keys(this.pendingChanges).length === 0) {
      return;
    }

    const changes = { ...this.pendingChanges };
    this.pendingChanges = {};

    // Convertir a formato del servidor (array de items)
    const configItems = Object.entries(changes).map(([campo, valor]) => ({
      campo,
      valor: String(valor),
    }));

    // Enviar cambios al servidor usando la ruta de la API
    router.post('/api/user-config', { configuraciones: configItems }, {
      onError: (errors) => {
        console.error('Error al sincronizar configuraciones:', errors);
        // Aquí podrías mostrar una notificación de error
      },
      onSuccess: () => {
        console.log('Configuraciones sincronizadas exitosamente');
        // Aquí podrías mostrar una notificación de éxito
      },
      preserveScroll: true,
      preserveState: true,
    });
  }

  /**
   * Fuerza la sincronización inmediata
   */
  forceSync(): void {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.syncWithServer();
  }

  /**
   * Limpia el timeout de sincronización
   */
  cleanup(): void {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = null;
    }
  }
}

export const configSyncService = ConfigSyncService.getInstance(); 