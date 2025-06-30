<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SessionService
{
    private DatabaseConnectionService $dbService;

    // Constantes para los tipos de programa
    private const TIPO_REGISTROS = 'R';
    private const TIPO_PROCESOS = 'P';
    private const TIPO_REPORTES = 'C';

    public function __construct(DatabaseConnectionService $dbService)
    {
        $this->dbService = $dbService;
    }

    /**
     * Obtiene la conexión del tenant
     *
     * @return \Illuminate\Database\Connection
     */
    private function getTenantConnection()
    {
        return $this->dbService->getConnection();
    }

    /**
     * Obtiene los datos completos de la sesión del usuario
     *
     * @param Request $request
     * @return array
     */
    public function getSessionData(Request $request)
    {
        $esApiRequest = $request->is('api/*');
        $this->handleSessionApi($request, $esApiRequest);

        $idUsuario = session('usuario')->id_usuario;
        $usuario = $this->getUser($idUsuario);

        $sesion = $this->initializeSession($usuario);
        $this->processCompanyData($sesion);
        $this->loadAssignedPrograms($sesion, $idUsuario, $esApiRequest);
        $this->loadFavoritePrograms($sesion, $idUsuario, $esApiRequest);

        return $sesion;
    }

    /**
     * Gestiona la sesión para solicitudes API
     *
     * @param Request $request
     * @param bool $esApiRequest
     * @return void
     */
    private function handleSessionApi(Request $request, bool $esApiRequest): void
    {
        if ($esApiRequest && $request->programa !== 'autenticacion.iniciar') {
            session()->put('usuario', (object) ['id_usuario' => $request->id_usuario]);
        }
    }

    /**
     * Obtiene el usuario por su ID
     *
     * @param int $idUsuario
     * @return User
     */
    private function getUser(int $idUsuario): User
    {
        return User::on('tenant')->where('id_usuario', $idUsuario)->firstOrFail();
    }

    /**
     * Inicializa la estructura de datos de sesión
     *
     * @param User $usuario
     * @return array
     */
    private function initializeSession(User $usuario): array
    {
        return [
            'usuario' => $usuario,
            'modulos' => $this->getModules($usuario->id_usuario),
            'programas' => [
                'registros' => [],
                'procesos' => [],
                'reportes' => [],
                'favoritos' => [],
                'genericos' => []
            ],
            'empresa' => $this->getCompanyData($usuario->id_usuario),
        ];
    }

    /**
     * Obtiene los módulos del usuario
     *
     * @param int $idUsuario
     * @return array
     */
    private function getModules(int $idUsuario): array
    {
        return $this->getTenantConnection()->select('EXEC [dbo].[p_traer_registros_combinados] ?, ?, ?', [$idUsuario, 'MODULOS', '']);
    }

    /**
     * Obtiene los datos de empresa para el usuario
     *
     * @param int $idUsuario
     * @return array
     */
    private function getCompanyData(int $idUsuario): array
    {
        return $this->getTenantConnection()->select('EXEC [dbo].[p_traer_registros] @id_usuario = ?, @renglon = ?', [$idUsuario, 'DATOS_INICIO_SESION', '']);
    }

    /**
     * Procesa los datos de empresa si existen
     *
     * @param array $sesion
     * @return void
     */
    private function processCompanyData(array &$sesion): void
    {
        if (!empty($sesion['empresa'])) {
            $sesion['empresa'] = $sesion['empresa'][0];
        }
    }

    /**
     * Carga los programas asignados al usuario
     *
     * @param array $sesion
     * @param int $idUsuario
     * @param bool $esApiRequest
     * @return void
     */
    private function loadAssignedPrograms(array &$sesion, int $idUsuario, bool $esApiRequest): void
    {
        $programas = $this->getTenantConnection()->select('EXEC p_traer_programas ?, ?, ?, ?', [$idUsuario, 'ASIGNADOS', '', 0]);

        if (!$esApiRequest) {
            $sesion['aplicacion']['rutas'] = array_keys(app('router')->getRoutes()->getRoutesByName()) ?? [];
        }

        foreach ($programas as $indice => $programa) {
            $tipoPrograma = $this->mapProgramType($programa->tipo_programa);
            $programa->tipo_programa = $tipoPrograma;

            if ($esApiRequest) {
                $this->processProgramForApi($sesion, $programa);
            } else {
                $this->processProgramForWeb($sesion, $programa, $indice);
            }
        }
    }

    /**
     * Carga los programas favoritos del usuario
     *
     * @param array $sesion
     * @param int $idUsuario
     * @param bool $esApiRequest
     * @return void
     */
    private function loadFavoritePrograms(array &$sesion, int $idUsuario, bool $esApiRequest): void
    {
        $sesion['programas']['favoritos'] = [];
        $programasFavoritos = $this->getTenantConnection()->select('EXEC p_traer_programas ?, ?, ?, ?', [$idUsuario, 'FAVORITOS', '', 0]);

        foreach ($programasFavoritos as $programa) {
            $tipoPrograma = $this->mapProgramType($programa->tipo_programa);
            $programa->tipo_programa = $tipoPrograma;

            if ($esApiRequest) {
                $this->processFavoriteProgramForApi($sesion, $programa);
            } else {
                $this->processFavoriteProgramForWeb($sesion, $programa);
            }
        }
    }

    /**
     * Mapea el código del tipo de programa a su descripción
     *
     * @param string $codigo
     * @return string|null
     */
    private function mapProgramType(string $codigo): ?string
    {
        $mapeo = [
            self::TIPO_REGISTROS => 'registros',
            self::TIPO_PROCESOS => 'procesos',
            self::TIPO_REPORTES => 'reportes'
        ];

        return $mapeo[$codigo] ?? null;
    }

    /**
     * Procesa un programa para formato API
     *
     * @param array $sesion
     * @param object $programa
     * @return void
     */
    private function processProgramForApi(array &$sesion, object $programa): void
    {
        if ($programa->aplicacion_movil && $programa->tipo_programa) {
            $sesion['programas'][$programa->tipo_programa][] = $programa;

            if ($programa->favorito) {
                $sesion['programas']['favoritos'][$programa->tipo_programa][] = $programa;
            }
        }
    }

    /**
     * Procesa un programa para formato Web
     *
     * @param array $sesion
     * @param object $programa
     * @param int $indice
     * @return void
     */
    private function processProgramForWeb(array &$sesion, object $programa, int $indice): void
    {
        if ($programa->tipo_programa && in_array($programa->programa, $sesion['aplicacion']['rutas'])) {
            $sesion['programas'][$programa->tipo_programa][$programa->id_modulo][] = $programa;

            if ($programa->favorito) {
                $sesion['programas']['favoritos'][] = $programa;
            }

            if ($programa->generico) {
                $sesion['programas']['genericos'][] = $programa->programa;
            }
        }
    }

    /**
     * Procesa un programa favorito para formato API
     *
     * @param array $sesion
     * @param object $programa
     * @return void
     */
    private function processFavoriteProgramForApi(array &$sesion, object $programa): void
    {
        if ($programa->aplicacion_movil && $programa->tipo_programa) {
            $sesion['programas']['favoritos'][$programa->tipo_programa][] = $programa;
        }
    }

    /**
     * Procesa un programa favorito para formato Web
     *
     * @param array $sesion
     * @param object $programa
     * @return void
     */
    private function processFavoriteProgramForWeb(array &$sesion, object $programa): void
    {
        if ($programa->tipo_programa && in_array($programa->programa, $sesion['aplicacion']['rutas'])) {
            $programa->referencia = $programa->descripcion;
            $sesion['programas']['favoritos'][] = $programa;
        }
    }
}
