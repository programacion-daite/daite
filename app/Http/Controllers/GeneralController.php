<?php

namespace App\Http\Controllers;
use App\Utils\Helpers;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function traerFiltros(Request $request)
    {
        info('traerFiltros');
        info($request->all());

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

   public static function validarProcedimiento($procedimiento)
   {
        $procedimientoPermitidos = [
            'p_traer_filtros',
            'p_traer_encabezado_consultas',
            'p_traer_entidades',
            'p_traer_unico_registro',
        ];

        if (!in_array($procedimiento, $procedimientoPermitidos)) {
            return response()->json([
                'error' => 'Hubo un inconveniente, por favor intente nuevamente'
            ], 400);
        }
   }


}

