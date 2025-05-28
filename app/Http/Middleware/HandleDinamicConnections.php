<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Helpers\DynamicConnection;


class HandleDinamicConnections
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && session()->has('conexion')) {
            $credentials = session('conexion');
            DynamicConnection::setConnection($credentials);
        }

        return $next($request);
    }
}
