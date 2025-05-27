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

        $resultado = $this->tenantAuthService->authenticateUser($usuario, $request->contrasena, $dispositivo, $origen);

        if ($resultado['error']) {
            Log::error('Error al autenticar usuario: ' . json_encode($resultado['data']));
            return redirect()->back()->withErrors(['mensaje' => $resultado['data']->mensaje ?? 'Error de autenticación']);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('inicio', false));
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {

        $request->session()->forget('conexion');
        $request->session()->forget('usuario');

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
