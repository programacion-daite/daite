<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SessionService
{
    // Constantes para los tipos de programa
    private const TIPO_REGISTROS = 'R';
    private const TIPO_PROCESOS = 'P';
    private const TIPO_REPORTES = 'C';

    /**
     * Obtiene los datos completos de la sesión del usuario
     *
     * @param Request $request
     * @return array
     */
    public function obtenerDatosSesion(Request $request)
    {
        Log::info('Procesando datos de sesión');

        $esApiRequest = $request->is('api/*');
        $this->gestionarSesionApi($request, $esApiRequest);

        $idUsuario = session('usuario')->id_usuario;
        $usuario = $this->obtenerUsuario($idUsuario);

        $sesion = $this->inicializarSesion($usuario);
        $this->cargarConfiguraciones($sesion, $idUsuario);
        $this->procesarDatosEmpresa($sesion);
        $this->cargarProgramasAsignados($sesion, $idUsuario, $esApiRequest);
        $this->cargarProgramasFavoritos($sesion, $idUsuario, $esApiRequest);

        return $sesion;
    }

    /**
     * Gestiona la sesión para solicitudes API
     *
     * @param Request $request
     * @param bool $esApiRequest
     * @return void
     */
    private function gestionarSesionApi(Request $request, bool $esApiRequest): void
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
    private function obtenerUsuario(int $idUsuario): User
    {
        return User::where('id_usuario', $idUsuario)->firstOrFail();
    }

    /**
     * Inicializa la estructura de datos de sesión
     *
     * @param User $usuario
     * @return array
     */
    private function inicializarSesion(User $usuario): array
    {
        return [
            'usuario' => $usuario,
            'modulos' => $this->obtenerModulos($usuario->id_usuario),
            'programas' => [
                'registros' => [],
                'procesos' => [],
                'reportes' => [],
                'favoritos' => [],
                'genericos' => []
            ],
            'empresa' => $this->obtenerDatosEmpresa($usuario->id_usuario),
            'configuracion' => []
        ];
    }

    /**
     * Obtiene los módulos del usuario
     *
     * @param int $idUsuario
     * @return array
     */
    private function obtenerModulos(int $idUsuario): array
    {
        return DB::select('EXEC [dbo].[p_traer_registros_combinados] ?, ?, ?', [$idUsuario, 'MODULOS', '']);
    }

    /**
     * Obtiene los datos de empresa para el usuario
     *
     * @param int $idUsuario
     * @return array
     */
    private function obtenerDatosEmpresa(int $idUsuario): array
    {
        return DB::select('EXEC [dbo].[p_traer_registros] @id_usuario = ?, @renglon = ?', [$idUsuario, 'DATOS_INICIO_SESION', '']);
    }

    /**
     * Carga las configuraciones del usuario
     *
     * @param array &$sesion
     * @param int $idUsuario
     * @return void
     */
    private function cargarConfiguraciones(array &$sesion, int $idUsuario): void
    {
        $configuraciones = DB::select('EXEC [dbo].[p_traer_configuraciones] ?, ?, ?', [$idUsuario, '', '']);

        foreach ($configuraciones as $configuracion) {
            $sesion['configuracion'][$configuracion->campo] = $configuracion->valor;
        }
    }

    /**
     * Procesa los datos de empresa si existen
     *
     * @param array &$sesion
     * @return void
     */
    private function procesarDatosEmpresa(array &$sesion): void
    {
        if (!empty($sesion['empresa'])) {
            $sesion['empresa'] = $sesion['empresa'][0];
        }
    }

    /**
     * Carga los programas asignados al usuario
     *
     * @param array &$sesion
     * @param int $idUsuario
     * @param bool $esApiRequest
     * @return void
     */
    private function cargarProgramasAsignados(array &$sesion, int $idUsuario, bool $esApiRequest): void
    {
        $programas = DB::select('EXEC p_traer_programas ?, ?, ?, ?', [$idUsuario, 'ASIGNADOS', '', 0]);

        if (!$esApiRequest) {
            $sesion['aplicacion']['rutas'] = array_keys(app('router')->getRoutes()->getRoutesByName()) ?? [];
        }

        foreach ($programas as $indice => $programa) {
            $tipoPrograma = $this->mapearTipoPrograma($programa->tipo_programa);
            $programa->tipo_programa = $tipoPrograma;

            if ($esApiRequest) {
                $this->procesarProgramaParaApi($sesion, $programa);
            } else {
                $this->procesarProgramaParaWeb($sesion, $programa, $indice);
            }
        }
    }

    /**
     * Carga los programas favoritos del usuario
     *
     * @param array &$sesion
     * @param int $idUsuario
     * @param bool $esApiRequest
     * @return void
     */
    private function cargarProgramasFavoritos(array &$sesion, int $idUsuario, bool $esApiRequest): void
    {
        $sesion['programas']['favoritos'] = [];
        $programasFavoritos = DB::select('EXEC p_traer_programas ?, ?, ?, ?', [$idUsuario, 'FAVORITOS', '', 0]);

        foreach ($programasFavoritos as $programa) {
            $tipoPrograma = $this->mapearTipoPrograma($programa->tipo_programa);
            $programa->tipo_programa = $tipoPrograma;

            if ($esApiRequest) {
                $this->procesarFavoritoParaApi($sesion, $programa);
            } else {
                $this->procesarFavoritoParaWeb($sesion, $programa);
            }
        }
    }

    /**
     * Mapea el código del tipo de programa a su descripción
     *
     * @param string $codigo
     * @return string|null
     */
    private function mapearTipoPrograma(string $codigo): ?string
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
     * @param array &$sesion
     * @param object $programa
     * @return void
     */
    private function procesarProgramaParaApi(array &$sesion, object $programa): void
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
     * @param array &$sesion
     * @param object $programa
     * @param int $indice
     * @return void
     */
    private function procesarProgramaParaWeb(array &$sesion, object $programa, int $indice): void
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
     * @param array &$sesion
     * @param object $programa
     * @return void
     */
    private function procesarFavoritoParaApi(array &$sesion, object $programa): void
    {
        if ($programa->aplicacion_movil && $programa->tipo_programa) {
            $sesion['programas']['favoritos'][$programa->tipo_programa][] = $programa;
        }
    }

    /**
     * Procesa un programa favorito para formato Web
     *
     * @param array &$sesion
     * @param object $programa
     * @return void
     */
    private function procesarFavoritoParaWeb(array &$sesion, object $programa): void
    {
        if ($programa->tipo_programa && in_array($programa->programa, $sesion['aplicacion']['rutas'])) {
            $programa->referencia = $programa->descripcion;
            $sesion['programas']['favoritos'][] = $programa;
        }
    }
}