<?php

namespace App\Http\Services;

use App\Utils\Helpers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Contracts\Routing\ResponseFactory;


class StoredProcedureService
{
    /**
     * Lista de procedimientos permitidos
     */
    private const ALLOWED_PROCEDURES = [
        'p_traer_filtros',
        'p_traer_encabezado_consultas',
        'p_traer_encabezado_registros',
        'p_traer_encabezado_procesos',
        'p_traer_encabezado_reportes',
        'p_traer_entidades',
        'p_traer_seguimientos',
        'p_traer_unico_registro',
        'p_traer_registros_consulta_principal',
        'p_traer_programas',
        'p_registrar_registros',
        'p_traer_registros_combinados',
        'p_traer_campos_registros',
        'p_traer_registros',
        'p_traer_informes',
        'p_traer_filtros_json',
        'p_traer_activos'
    ];

    /**
     * Ejecuta un procedimiento almacenado y retorna su resultado
     *
     * @param Request $request
     * @param string $procedure
     * @return \Illuminate\Http\Response
     */
    public function executeProcedure(Request $request, string $procedure): Response|ResponseFactory
    {
        $request->merge(['procedimiento' => $procedure]);
        $this->validateProcedure($procedure);

        $data = json_encode($request->all());

        return Helpers::executeProcedure($data);
    }

    /**
     * Valida que el procedimiento esté en la lista de permitidos
     *
     * @param string $procedure
     * @throws \Exception
     */
    private function validateProcedure(string $procedure): void
    {
        if (!in_array($procedure, self::ALLOWED_PROCEDURES)) {
            throw new \Exception('Procedimiento no permitido');
        }
    }
}
