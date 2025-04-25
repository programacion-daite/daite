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

    public function traerOpciones(Request $request) {

        if($request->get('isGeneric')) {

            $id = $request->id;
            $description = str_replace('id_', '', $id);

            $request->merge([
                'origen_registros' => $request->table,
                'campos' => "{$id} as valor, {$description} as descripcion",
            ]);

            self::validarProcedimiento($request->get('procedimiento'));

            $resultado =  $this->registrosConsultaPrincipal($request);
        } else {
            $resultado = $this->traerFiltros($request);
        }

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

