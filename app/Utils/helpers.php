<?php

namespace App\Utils;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Contracts\Routing\ResponseFactory;

class Helpers
{

    private static $esquema = 'dbo';
    public static function esquema(Request $request): array
    {

        $entidad = (object) [
            'esquema' => $request->esquema ?? self::$esquema,
            'nombre' =>
                $request->funcion ??
                $request->procedimiento ??
                $request->tabla,
            'sentencia' => $request->funcion || $request->procedimiento
                ? "
                SELECT
                  ordinal_position AS posicion,
                  data_type AS tipo,
                  REPLACE(parameter_name, '@', '') AS nombre,
                  character_maximum_length AS cantidad_maxima_caracteres
                FROM
                  information_schema.parameters
                WHERE
                  specific_schema = ? AND
                  specific_name = ? AND
                                ordinal_position > 0
                ORDER BY
                  ordinal_position
                "
                : "
                SELECT
                  ordinal_position AS posicion,
                  data_type AS tipo,
                  column_name AS nombre,
                  column_default AS valor_predeterminado,
                  CONVERT(BIT, CASE is_nullable WHEN 'YES' THEN 1 ELSE 0 END) AS valor_nulo,
                  character_maximum_length AS longitud_maxima_caracteres
                FROM
                  information_schema.columns
                WHERE
                  table_schema = ? AND
                  table_name = ?
                "
        ];

        // if (!$entidad->nombre)
        //   return abort(422)
        // ;

        return DB::select('SET NOCOUNT ON;' . $entidad->sentencia, [$entidad->esquema, $entidad->nombre]);

    }

    public static function EjecutarProcedimiento(Request $request): Response|ResponseFactory|\Illuminate\Http\Response
    {

        $api = $request->is('api/*');

        $entidad = (object) [
            'esquema' => $request->esquema ?? self::$esquema,
            'nombre' => $request->procedimiento ?? $request->funcion,
            'parametros' => self::esquema($request)
        ];

        $peticion = (object) [
            'parametros' => null,
            'ataduras' => null,
            'consulta' => null,
            'datos' => null
        ];

        if (empty($entidad->parametros) && $entidad->nombre != 'p_registrar_registros') {
            \Log::info("LA ENTIDAD NO TIENE PARAMETROS $entidad->nombre");
            return abort(422);
        }

        foreach ($entidad->parametros as $indice => $parametro) {

            $parametro->posicion = intval($parametro->posicion);

            if ($parametro->cantidad_maxima_caracteres) {

                $parametro->cantidad_maxima_caracteres =
                    intval($parametro->cantidad_maxima_caracteres)
                ;

                $parametro->cantidad_maxima_caracteres === -1 && $parametro->cantidad_maxima_caracteres = null;

            }


            if (
                $parametro->posicion === 1 &&
                strpos($parametro->nombre, 'id_usuario') === 0 &&
                !$request[$parametro->nombre] &&
                !in_array($entidad->nombre, ['p_traer_valor']) // Procedimientos que pueden ejecutarse sin usuario
            ) {
                $request[$parametro->nombre] = session('usuario')->id_usuario ?? 1;
            }

            switch ($parametro->tipo) {

                case 'bit':
                    $request[$parametro->nombre] =
                        boolval($request[$parametro->nombre])
                    ;
                    break;

                case 'int':
                    $request[$parametro->nombre] =
                        intval($request[$parametro->nombre])
                    ;
                    break;

                case 'decimal':
                    $request[$parametro->nombre] = floatval(
                        str_replace(',', '', $request[$parametro->nombre])
                    );
                    break;

                case 'numeric':
                    $request[$parametro->nombre] = floatval(
                        str_replace(',', '', $request[$parametro->nombre])
                    );
                    break;

                case 'datetime':
                    $request[$parametro->nombre] = date(
                        'Y-m-d H:i:s',
                        strtotime($request[$parametro->nombre])
                    );
                break;

                default:

                    if ($request->hasFile($parametro->nombre))
                        $request[$parametro->nombre] =
                            $request->file($parametro->nombre)->store('archivos/imagenes');
                    else if (
                        $entidad->nombre !== 'p_registrar_programas' &&
                        strpos($parametro->nombre, 'json') === false &&
                        strpos($parametro->nombre, 'campo') === false &&
                        strpos($parametro->nombre, 'sql') === false
                    )
                        $request[$parametro->nombre] = strtoupper($request[$parametro->nombre])
                        ;

                    if (
                        strpos($parametro->nombre, 'desde') === 0 ||
                        strpos($parametro->nombre, 'hasta') === 0 ||
                        strpos($parametro->nombre, 'fecha') === 0
                    )
                        $request[$parametro->nombre] = str_replace('-', '', $request[$parametro->nombre])
                        ;

                    break;

            }

            if (
                $request[$parametro->nombre] &&
                $parametro->cantidad_maxima_caracteres &&
                strlen($request[$parametro->nombre]) > $parametro->cantidad_maxima_caracteres
            )
                return response([
                    (object) [
                        'mensaje' => strtoupper("
                ¡El campo [$parametro->nombre] no puede exceder de [$parametro->cantidad_maxima_caracteres] digitos!
              "),
                        'campo' => $parametro->nombre,
                        'codigo_estado' => 400
                    ]
                ], 400)
                ;

            $peticion->parametros[] = $request[$parametro->nombre] ?? '';

            $peticion->ataduras[] = '?';

        }

        $peticion->consulta = $request->procedimiento
            ? "SET NOCOUNT ON; EXEC $entidad->esquema.$entidad->nombre"
            : "SET NOCOUNT ON; SELECT $entidad->esquema.$entidad->nombre"
        ;

        setcookie('Consulta', null, -1);

        if (!$api && session('usuario') && session('usuario')->depurador) {

            $parametros = array_map(function ($parametro) {

                return (
                    !is_int($parametro) &&
                    !is_float($parametro)
                )
                    ? "'$parametro'"
                    : $parametro
                ;

            }, $peticion->parametros);

            setcookie(
                'Consulta',
                $peticion->consulta . implode(', ', $parametros)
            );

        }

        if ($request->retorna ?? true)
            $peticion->datos = $request->procedimiento
                ? DB::select(
                    $peticion->consulta . ' ' . implode(', ', $peticion->ataduras),
                    $peticion->parametros
                )
                : DB::select(
                    $peticion->consulta . ' (' . implode(', ', $peticion->ataduras) . ')',
                    $peticion->parametros
                )
            ;
        else
            $peticion->datos = $request->procedimiento
                ? DB::statement(
                    $peticion->consulta . ' ' . implode(', ', $peticion->ataduras),
                    $peticion->parametros
                )
                : DB::statement(
                    $peticion->consulta . '(' . implode(', ', $peticion->ataduras) . ')',
                    $peticion->parametros
                )
            ;

        $respuesta = response(
            $peticion->datos,
            $peticion->datos[0]?->codigo_estado ?? 200
        );

        return $respuesta;

    }

}



