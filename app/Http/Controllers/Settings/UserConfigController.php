<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UserConfigController extends Controller
{
    /**
     * Actualizar las configuraciones globales del usuario
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'configuraciones' => 'required|array',
            'configuraciones.*.campo' => 'required|string|max:255',
            'configuraciones.*.valor' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        
        $cacheKey = "user_config_{$user->id_usuario}";
        $currentConfig = Cache::get($cacheKey, []);
        
        foreach ($validated['configuraciones'] as $config) {
            $currentConfig[$config['campo']] = $config['valor'];
        }
        
        Cache::put($cacheKey, $currentConfig, now()->addMinutes(30));

        return response()->json([
            'success' => true,
            'message' => 'Configuraciones actualizadas exitosamente',
            'data' => $currentConfig,
        ]);
    }

    /**
     * Obtener las configuraciones actuales del usuario
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $cacheKey = "user_config_{$user->id_usuario}";
        
        $config = Cache::get($cacheKey, $this->getDefaultConfig());

        // Convertir a formato de array de items
        $configItems = [];
        foreach ($config as $campo => $valor) {
            $configItems[] = [
                'campo' => $campo,
                'valor' => $valor,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $configItems,
        ]);
    }

    /**
     * Resetear configuraciones a valores por defecto
     */
    public function reset(Request $request): JsonResponse
    {
        $user = $request->user();
        $cacheKey = "user_config_{$user->id_usuario}";
        
        $defaultConfig = $this->getDefaultConfig();
        Cache::put($cacheKey, $defaultConfig, now()->addMinutes(30));

        // Convertir a formato de array de items
        $configItems = [];
        foreach ($defaultConfig as $campo => $valor) {
            $configItems[] = [
                'campo' => $campo,
                'valor' => $valor,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Configuraciones reseteadas a valores por defecto',
            'data' => $configItems,
        ]);
    }

    /**
     * Obtener configuraciones por defecto
     */
    private function getDefaultConfig(): array
    {
        return [
            'modalidad_db' => 'b',
            'mensaje_guardar' => 'Guardado con éxito su transacción',
            'fecha_inicio_datos' => '20230101',
            'tipo_calculo_defecto' => '1',
            'cliente_daite' => 'si',
            'correos_enviar_copias_seguimientos' => '',
            'abrir_desglose_efectivo' => '1',
            'ancho_boton' => '150',
            'altura_boton' => '65',
            'color_boton' => '#005cac',
            'color_texto_boton' => '#ffffff',
            'cantidad_registros_mostrar_busqueda_selector' => '10',
            'cantidad_registros_visible_selector' => '10',
            'nombre_db' => 'naralyfarmacia',
            'dns_db' => 'daitesrl.ddns.net,56434',
        ];
    }
} 