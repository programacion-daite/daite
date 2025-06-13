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

        $sesionData = [];
        $sidebarItems = [];

        if ($request->session()->has('conexion') && $request->user()) {
            $cacheKey = "sesion_data_{$request->user()->id_usuario}";
            $sesionData = Cache::remember($cacheKey, now()->addMinutes(5), function() use ($request) {
                return $this->sessionService->getSessionData($request);
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
            'sessionData' => $sesionData,
        ];
    }

    /**
     * Extrae los elementos para la barra lateral de los datos de sesión
     *
     * @param array $sesionData
     * @return array
     */
    protected function obtenerSidebarItems(array $sesionData): array
    {
        $items = [];

        if (empty($sesionData['programas'])) {
            return $items;
        }

        foreach (['registros', 'procesos', 'reportes'] as $tipo) {
            if (!empty($sesionData['programas'][$tipo])) {
                foreach ($sesionData['programas'][$tipo] as $idModulo => $programasModulo) {
                    foreach ($programasModulo as $programa) {
                        $items[] = [
                            'id' => $programa->id_programa,
                            'name' => $programa->descripcion,
                            'route' => $programa->programa,
                            'type' => $tipo,
                            'module_id' => $idModulo,
                            'icon' => $programa->icono ?? 'default-icon'
                        ];
                    }
                }
            }
        }

        return $items;
    }
}