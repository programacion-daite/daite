<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;

class DynamicConnection
{
    private const CACHE_KEY = 'tenant_connection_';
    private const CACHE_TTL = 1440; // 24 horas en minutos

    public static function setConnection($credenciales)
    {
        $userId = session('usuario')->id_usuario ?? 'default';
        $cacheKey = self::CACHE_KEY . $userId;

        if (Cache::has($cacheKey)) {
            return;
        }

        $requiredParams = ['hospedaje', 'puerto', 'base_datos', 'usuario', 'contrasena'];

        foreach ($requiredParams as $param) {
            if (!property_exists($credenciales, $param) || empty($credenciales->$param)) {
                throw new \Exception("Missing required connection parameter: {$param}");
            }
        }

        $config = [
            'driver' => 'sqlsrv',
            'host' => $credenciales->hospedaje,
            'port' => $credenciales->puerto,
            'database' => $credenciales->base_datos,
            'username' => $credenciales->usuario,
            'password' => $credenciales->contrasena,
            'charset' => 'utf8',
            'prefix' => '',
        ];

        Config::set('database.connections.tenant', $config);

        try {
            DB::connection('tenant')->getPdo();

            Cache::put($cacheKey, $config, self::CACHE_TTL);
        } catch (\Exception $e) {
            throw new \Exception("Failed to establish database connection: " . $e->getMessage());
        }
    }

    public static function clearConnection()
    {
        $userId = session('usuario')->id_usuario ?? 'default';
        $cacheKey = self::CACHE_KEY . $userId;

        Cache::forget($cacheKey);
        DB::purge('tenant');
    }

    public static function getConnection()
    {
        $userId = session('usuario')->id_usuario ?? 'default';
        $cacheKey = self::CACHE_KEY . $userId;

        if (Cache::has($cacheKey)) {
            $config = Cache::get($cacheKey);
            Config::set('database.connections.tenant', $config);
            return DB::connection('tenant');
        }

        throw new \Exception("No active database connection found");
    }
}