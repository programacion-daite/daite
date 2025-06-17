<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Services\TenantAuthService;
use Illuminate\Support\Facades\Log;
use App\Helpers\DynamicConnection;

class AuthenticatedSessionController extends Controller
{

    protected $tenantAuthService;

    public function __construct(TenantAuthService $tenantAuthService)
    {
        $this->tenantAuthService = $tenantAuthService;
    }

    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {

        $usuario = $request->usuario ?? $request->nombre_usuario;
        $dispositivo = $request->dispositivo ?? $request->header('User-Agent');
        $origen = $request->origen ?? ($request->is('api/*') ? 'MÓVIL' : 'WEB');

        $resultado = $this->tenantAuthService->authenticateUser($usuario, $request->contrasena, $dispositivo, $origen);

        if ($resultado['error']) {
            Log::error('Error al autenticar usuario: ' . json_encode($resultado['data']));
            return redirect()->back()->withErrors(['mensaje' => $resultado['data']->mensaje ?? 'Error de autenticación']);
        }

        // Configurar la conexión en caché después de una autenticación exitosa
        try {
            DynamicConnection::setConnection($resultado['data']->conexion);
        } catch (\Exception $e) {
            Log::error('Error al configurar la conexión: ' . $e->getMessage());
            return redirect()->back()->withErrors(['mensaje' => 'Error al configurar la conexión a la base de datos']);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('inicio', false));
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Limpiar la conexión en caché antes de cerrar la sesión
        try {
            DynamicConnection::clearConnection();
        } catch (\Exception $e) {
            Log::error('Error al limpiar la conexión: ' . $e->getMessage());
        }

        $request->session()->forget('conexion');
        $request->session()->forget('usuario');

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
