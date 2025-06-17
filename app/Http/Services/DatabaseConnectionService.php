<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class DatabaseConnectionService
{
    private const CONNECTION_NAME = 'tenant';

    /**
     * Establece la conexión a la base de datos
     *
     * @param object $credentials
     * @return void
     * @throws \Exception
     */
    public function setConnection($credentials): void
    {
        try {
            $config = [
                'driver' => 'sqlsrv',
                'host' => $credentials->hospedaje,
                'port' => $credentials->puerto,
                'database' => $credentials->base_datos,
                'username' => $credentials->usuario,
                'password' => $credentials->contrasena,
                'charset' => 'utf8',
                'prefix' => '',
                'encrypt' => 'yes',
                'trust_server_certificate' => 'true',
            ];

            // Configuramos la conexión
            Config::set('database.connections.' . self::CONNECTION_NAME, $config);

            // Verificamos la conexión
            DB::connection(self::CONNECTION_NAME)->getPdo();

            Log::info('Conexión establecida correctamente', [
                'database' => $credentials->base_datos,
                'host' => $credentials->hospedaje
            ]);
        } catch (\Exception $e) {
            Log::error('Error al establecer la conexión: ' . $e->getMessage(), [
                'credentials' => $credentials
            ]);
            throw new \Exception('Error al establecer la conexión: ' . $e->getMessage());
        }
    }

    /**
     * Obtiene la conexión actual
     *
     * @return \Illuminate\Database\Connection
     * @throws \Exception
     */
    public function getConnection()
    {
        try {
            return DB::connection(self::CONNECTION_NAME);
        } catch (\Exception $e) {
            Log::error('Error al obtener la conexión: ' . $e->getMessage());
            throw new \Exception('No se pudo obtener la conexión a la base de datos');
        }
    }

    /**
     * Limpia la conexión actual
     *
     * @return void
     */
    public function clearConnection(): void
    {
        DB::purge(self::CONNECTION_NAME);
        Config::set('database.connections.' . self::CONNECTION_NAME, null);
    }
}
