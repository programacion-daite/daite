<?php

namespace App\Http\Controllers;
use App\Utils\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class GeneralController extends Controller
{
    public function traerFiltros(Request $request)
    {
        info('traerFiltros');
        info($request->all());

        $request->merge([
            'procedimiento' => 'p_traer_filtros',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerEncabezadoConsultas(Request $request)
    {
        info('traerEncabezadoConsultas');

        $request->merge([
            'procedimiento' => 'p_traer_encabezado_consultas',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerEncabezadoRegistros(Request $request)
    {
        info('traerEncabezadoConsultas');

        $request->merge([
            'procedimiento' => 'p_traer_encabezado_registros',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerEncabezadoProcesos(Request $request)
    {
        info('traerEncabezadoConsultas');

        $request->merge([
            'procedimiento' => 'p_traer_encabezado_procesos',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerEncabezadoReportes(Request $request)
    {
        info('traerEncabezadoConsultas');

        $request->merge([
            'procedimiento' => 'p_traer_encabezado_reportes',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerEntidades(Request $request)
    {
        info('traerEntidades');
        info($request->all());

        $request->merge([
            'procedimiento' => 'p_traer_entidades',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerLotesPagos(Request $request)
    {
        info('traerEntidades');
        info($request->all());

        $request->merge([
            'procedimiento' => 'p_traer_seguimientos',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerUnicaEntidad(Request $request)
    {
        info('traerUnicaEntidad');

        $request->merge([
            'procedimiento' => 'p_traer_unico_registro',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        info($request->all());

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function esquema(Request $request)
    {
        info('esquema');

        $resultado = Helpers::esquema($request);

        return response()->json([
            $resultado
        ]);
    }

    public function registrosConsultaPrincipal(Request $request)
    {
        info('registrosConsultaPrincipal');
        \Log::info($request->all());

        $request->merge([
            'procedimiento' => 'p_traer_registros_consulta_principal',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }
    
    public function traerRegistrosCombinados(Request $request) {
        info('traerRegistrosCombinados');
        \Log::info($request->all());

        $request->merge([
            'procedimiento' => 'p_traer_registros_combinados',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function registrarRegistros(Request $request)
    {
        info('registrarRegistros');
        \Log::info($request->all());

        $request->merge([
            'procedimiento' => 'p_registrar_registros',
        ]);

        self::validarProcedimiento($request->get('procedimiento'));

        $resultado = Helpers::ejecutarProcedimiento($request);

        return response()->json([
            $resultado
        ]);
    }

    public function traerDatosSesion(Request $request)
    {
        info('sesion');

        $api = $request->is('api/*');

        if ($api && $request->programa !== 'autenticacion.iniciar')
            session()->put('usuario', (object) ['id_usuario' => $request->id_usuario]);
        ;

        $usuario = User::where('id_usuario', session('usuario')->id_usuario)->first();

        $sesion = [
            'usuario' => $usuario,
            'modulos' => DB::select('EXEC [dbo].[p_traer_registros_combinados] ?, ?, ?', [$usuario->id_usuario, 'MODULOS', '']),
            'programas' => [
                'registros' => [],
                'procesos' => [],
                'reportes' => [],
                'favoritos' => [],
                'genericos' => []
            ],
            'empresa' => DB::select('EXEC [dbo].[p_traer_registros] @id_usuario = ?, @renglon = ?', [$usuario->id_usuario, 'DATOS_INICIO_SESION', ''])
        ];

        foreach (DB::select('EXEC [dbo].[p_traer_configuraciones] ?, ?, ?', [$usuario->id_usuario, '', '']) as $indice => $configuracion)
            $sesion['configuracion'][$configuracion->campo] = $configuracion->valor
            ;

        if (count($sesion['empresa']))
            $sesion['empresa'] = $sesion['empresa'][0]
            ;

        foreach (DB::select('EXEC p_traer_programas ?, ?, ?, ?', [$usuario->id_usuario, 'ASIGNADOS', '', 0]) as $indice => $programa) {

            switch ($programa->tipo_programa) {

                case 'R':
                    $programa->tipo_programa = 'registros';
                    break;

                case 'P':
                    $programa->tipo_programa = 'procesos';
                    break;

                case 'C':
                    $programa->tipo_programa = 'reportes';
                    break;

                default:
                    $programa->tipo_programa = null;
                    break;

            }

            if ($api) {

                if ($programa->aplicacion_movil && $programa->tipo_programa) {

                    $sesion['programas'][$programa->tipo_programa][] = $programa;

                    $programa->favorito &&
                        $sesion['programas']['favoritos'][$programa->tipo_programa][] = $programa;

                }

            } else {

                if ($indice === 0)
                    $sesion['aplicacion']['rutas'] = array_keys(app('router')->getRoutes()->getRoutesByName()) ?? []
                    ;

                if ($programa->tipo_programa && in_array($programa->programa, $sesion['aplicacion']['rutas'])) {

                    $sesion['programas'][$programa->tipo_programa][$programa->id_modulo][] = $programa;

                    $programa->favorito &&
                        $sesion['programas']['favoritos'][] = $programa;

                    $programa->generico &&
                        $sesion['programas']['genericos'][] = $programa->programa;

                }

            }

        }

        $sesion['programas']['favoritos'] = [];

        foreach (DB::select('EXEC p_traer_programas ?, ?, ?, ?', [$usuario->id_usuario, 'FAVORITOS', '', 0]) as $indice => $programa) {

            switch ($programa->tipo_programa) {

                case 'R':
                    $programa->tipo_programa = 'registros';
                    break;

                case 'P':
                    $programa->tipo_programa = 'procesos';
                    break;

                case 'C':
                    $programa->tipo_programa = 'reportes';
                    break;

                default:
                    $programa->tipo_programa = null;
                    break;

            }

            if ($api) {

                if ($programa->aplicacion_movil && $programa->tipo_programa)
                    $sesion['programas']['favoritos'][$programa->tipo_programa][] = $programa;

            } else if ($programa->tipo_programa && in_array($programa->programa, $sesion['aplicacion']['rutas'])) {

                $programa->referencia = $programa->descripcion;

                $sesion['programas']['favoritos'][] = $programa;

            }

        }


        return $sesion;
    }

    public static function validarProcedimiento($procedimiento)
    {
        $procedimientoPermitidos = [
            'p_traer_filtros',
            'p_traer_encabezado_consultas',
            'p_traer_entidades',
            'p_traer_unico_registro',
            'p_traer_registros_consulta_principal',
            'p_traer_programas',
            'p_registrar_registros',
            'p_traer_registros_combinados'
        ];

        if (!in_array($procedimiento, $procedimientoPermitidos)) {
            return response()->json([
                'error' => 'Hubo un inconveniente, por favor intente nuevamente'
            ], 400);
        }
    }

}

