<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class HandleDinamicConnections
{
    public function handle($request, Closure $next)
    {
        if (session()->has('conexion')) {
            $credenciales = session('conexion');

            Config::set('database.connections.sqlsrv.host', $credenciales->hospedaje);
            Config::set('database.connections.sqlsrv.port', $credenciales->puerto);
            Config::set('database.connections.sqlsrv.database', $credenciales->base_datos);
            Config::set('database.connections.sqlsrv.username', $credenciales->usuario);
            Config::set('database.connections.sqlsrv.password', $credenciales->contrasena);

            DB::purge('sqlsrv');
            DB::reconnect('sqlsrv');
        }

        return $next($request);
    }
}
