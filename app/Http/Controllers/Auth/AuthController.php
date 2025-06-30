<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Services\TenantAuthService;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{

    protected $tenantAuthService;

    public function __construct(TenantAuthService $tenantAuthService)
    {
        $this->tenantAuthService = $tenantAuthService;
    }

    /**
     * Show the login page.
     */
    public function index(Request $request): Response
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
        $user = $request->usuario ?? $request->nombre_usuario;
        $device = $request->dispositivo ?? $request->header('User-Agent');
        $origin = $request->origen ?? ($request->is('api/*') ? 'MÓVIL' : 'WEB');

        $result = $this->tenantAuthService->authenticateUser(
            $user,
            $request->contrasena,
            $device,
            $origin
        );

        if ($result['error']) {
            Log::error('Error al autenticar usuario: ' . json_encode($result['data']));
            return redirect()->back()->withErrors(['mensaje' => $result['data']->mensaje ?? 'Error de autenticación']);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('inicio', false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            $this->tenantAuthService->setConnectionName('tenant');
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
