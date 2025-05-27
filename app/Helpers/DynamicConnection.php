<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class DynamicConnection
{
    private static $connectionName = 'tenant';

    public static function setConnection($credenciales)
    {

        $self = new self();
        $requiredParams = ['hospedaje', 'puerto', 'base_datos', 'usuario', 'contrasena'];

        foreach ($requiredParams as $param) {
            if (!property_exists($credenciales, $param) || empty($credenciales->$param)) {
                throw new \Exception("Missing required connection parameter: {$param}");
            }
        }

        Config::set('database.connections.' . self::$connectionName, [
            'driver' => 'sqlsrv',
            'host' => $credenciales->hospedaje,
            'port' => $credenciales->puerto,
            'database' => $credenciales->base_datos,
            'username' => $credenciales->usuario,
            'password' => $credenciales->contrasena,
            'charset' => 'utf8',
            'prefix' => '',
        ]);

        try {
            DB::connection(self::$connectionName)->getPdo();
        } catch (\Exception $e) {
            throw new \Exception("Failed to establish database connection: " . $e->getMessage());
        }
    }
}