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

        $resultado = $this->tenantAuthService->autenticarUsuario($usuario, $request->contrasena, $dispositivo, $origen);

        // Si ocurre algún error en la autenticación, se redirige hacia atrás con los errores
        if ($resultado['error']) {
            Log::error('Error al autenticar usuario: ' . json_encode($resultado['data']));
            return redirect()->back()->withErrors(['mensaje' => $resultado['data']->mensaje ?? 'Error de autenticación']);
        }

        // Regenera la sesión para evitar fijación de sesión
        $request->session()->regenerate();

        // Redirige al dashboard (o a la ruta deseada) utilizando redirect()->intended
        return redirect()->intended(route('dashboard', false));
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Limpiar la conexión dinámica antes de cerrar la sesión
        $request->session()->forget('conexion');
        $request->session()->forget('usuario');

        // Cerrar la sesión
        Auth::guard('web')->logout();

        // Invalidar la sesión
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirigir al login
        return redirect()->route('login');
    }
}
