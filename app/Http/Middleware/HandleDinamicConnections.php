<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Http\Services\DatabaseConnectionService;
use Illuminate\Support\Facades\DB;

class HandleDinamicConnections
{
    private DatabaseConnectionService $dbService;

    public function __construct(DatabaseConnectionService $dbService)
    {
        $this->dbService = $dbService;
    }

    public function handle($request, Closure $next)
    {
        if (Auth::check() && session()->has('conexion')) {
            try {
                // Check if connection is already established
                try {
                    DB::connection('tenant')->getPdo();
                    return $next($request);
                } catch (\Exception $e) {
                    // If connection is not established, configure it
                    $credentials = session('conexion');
                    $this->dbService->setConnection($credentials);
                }
            } catch (\Exception $e) {
                // If there's an error configuring the connection, clear the session
                Auth::logout();
                session()->flush();
                return redirect()->route('login')->withErrors(['mensaje' => 'Error de conexión a la base de datos']);
            }
        }

        return $next($request);
    }
}
