<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Http\Services\DatabaseConnectionService;

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
                $credentials = session('conexion');
                $this->dbService->setConnection($credentials);
            } catch (\Exception $e) {
                // Si hay un error al configurar la conexión, limpiamos la sesión
                Auth::logout();
                session()->flush();
                return redirect()->route('login')->withErrors(['mensaje' => 'Error de conexión a la base de datos']);
            }
        }

        return $next($request);
    }
}
