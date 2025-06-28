<?php

namespace App\Http\Middleware;

use App\Http\Services\SessionService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * La instancia del servicio de sesión
     *
     * @var SessionService
     */
    protected $sessionService;

    /**
     * Constructor del middleware
     *
     * @param SessionService $sessionService
     */
    public function __construct(SessionService $sessionService)
    {
        $this->sessionService = $sessionService;
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $userModules = [];
        $userPrograms = [];
        $companyData = [];
        $applicationRoutes = [];
        $userGlobalConfig = [];

        if ($request->session()->has('conexion') && $request->user()) {

            // Get session data (cache of 5 minutes)
            $cacheKey = "sesion_data_{$request->user()->id_usuario}";
            $sesionData = Cache::remember($cacheKey, now()->addMinutes(5), function() use ($request) {
                return $this->sessionService->getSessionData($request);
            });

            // Extract specific data
            $userModules = $sesionData['modulos'] ?? [];
            $userPrograms = $sesionData['programas'] ?? [];
            $companyData = $sesionData['empresa'] ?? [];
            $applicationRoutes = $sesionData['aplicacion']['rutas'] ?? [];

            // Get user global configurations (cache of 30 minutes)
            $userConfigKey = "user_config_{$request->user()->id_usuario}";
            $userGlobalConfig = Cache::remember($userConfigKey, now()->addMinutes(30), function() use ($request) {
                return $this->getUserGlobalConfig($request);
            });

        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'programa' => $request->route()->getName(),

            // Distributed Session Data
            'userModules' => $userModules,
            'userPrograms' => $userPrograms,
            'companyData' => $companyData,
            'applicationRoutes' => $applicationRoutes,
            'userGlobalConfig' => $userGlobalConfig,
        ];
    }

    /**
     * Obtiene las configuraciones globales del usuario
     *
     * @param Request $request
     * @return array
     */
    protected function getUserGlobalConfig(Request $request): array
    {
        $idUsuario = $request->user()->id_usuario;
        
        $configuraciones = app(\App\Http\Services\DatabaseConnectionService::class)
            ->getConnection()
            ->select('EXEC [dbo].[p_traer_configuraciones] ?, ?, ?', [$idUsuario, '', '']);

        $configItems = [];
        foreach ($configuraciones as $configuracion) {
            $configItems[] = [
                'campo' => $configuracion->campo,
                'valor' => $configuracion->valor,
            ];
        }

        return $configItems;
    }
}