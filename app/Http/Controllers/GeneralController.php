<?php

namespace App\Http\Controllers;

use App\Utils\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Contracts\Routing\ResponseFactory;

class GeneralController extends Controller
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
        'p_traer_registros_combinados'
    ];

    /**
     * Ejecuta un procedimiento almacenado y retorna su resultado
     *
     * @param Request $request
     * @param string $procedure
     * @return \Illuminate\Http\Response
     */
    private function executeProcedure(Request $request, string $procedure): Response|ResponseFactory
    {
        Log::info("Ejecutando procedimiento: {$procedure}", $request->all());

        $request->merge(['procedimiento' => $procedure]);
        $this->validateProcedure($procedure);

        $data = json_encode($request->all());

        info($data);

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

    /**
     * Obtiene los filtros
     */
    public function getFilters(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_filtros');
    }

    /**
     * Obtiene el encabezado de consultas
     */
    public function getQueryHeader(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_encabezado_consultas');
    }

    /**
     * Obtiene el encabezado de registros
     */
    public function getRecordsHeader(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_encabezado_registros');
    }

    /**
     * Obtiene el encabezado de procesos
     */
    public function getProcessesHeader(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_encabezado_procesos');
    }

    /**
     * Obtiene el encabezado de reportes
     */
    public function getReportsHeader(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_encabezado_reportes');
    }

    /**
     * Obtiene las entidades
     */
    public function getEntities(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_entidades');
    }

    /**
     * Obtiene los lotes de pagos
     */
    public function getPaymentBatches(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_seguimientos');
    }

    /**
     * Obtiene una única entidad
     */
    public function getSingleEntity(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_unico_registro');
    }

    /**
     * Obtiene el esquema
     */
    public function getSchema(Request $request)
    {
        info('Obteniendo esquema', $request->all());
        $result = Helpers::getSchema($request);
        return response()->json(['data' => $result]);
    }

    /**
     * Obtiene los registros de la consulta principal
     */
    public function getMainQueryRecords(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_registros_consulta_principal');
    }

    /**
     * Obtiene registros combinados
     */
    public function getCombinedRecords(Request $request)
    {
        return $this->executeProcedure($request, 'p_traer_registros_combinados');
    }

    /**
     * Obtiene las opciones
     */
    public function getOptions(Request $request)
    {
        if ($request->get('isGeneric')) {
            $id = $request->id;
            $description = str_replace('id_', '', $id);

            $request->merge([
                'origen_registros' => $request->table,
                'campos' => "{$id} as valor, {$description} as descripcion",
            ]);

            return $this->getMainQueryRecords($request);
        }

        return $this->getFilters($request);
    }

    /**
     * Registra registros
     */
    public function registerRecords(Request $request)
    {
        return $this->executeProcedure($request, 'p_registrar_registros');
    }
}

