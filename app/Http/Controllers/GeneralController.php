<?php

namespace App\Http\Controllers;

use App\Http\Services\StoredProcedureService;
use App\Utils\Helpers;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function __construct(
        protected StoredProcedureService $storedProcedureService,
    ) {}

    /**
     * Obtiene los filtros
     */
    public function getFilters(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_filtros');
    }

    /**
     * Obtiene el encabezado de consultas
     */
    public function getQueryHeader(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_encabezado_consultas');
    }

    /**
     * Obtiene el encabezado de registros
     */
    public function getRecordsHeader(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_encabezado_registros');
    }

    /**
     * Obtiene el encabezado de procesos
     */
    public function getProcessesHeader(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_encabezado_procesos');
    }

    /**
     * Obtiene el encabezado de reportes
     */
    public function getReportsHeader(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_encabezado_reportes');
    }

    /**
     * Obtiene las entidades
     */
    public function getEntities(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_entidades');
    }

    /**
     * Obtiene los lotes de pagos
     */
    public function getPaymentBatches(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_seguimientos');
    }

    /**
     * Obtiene una única entidad
     */
    public function getSingleEntity(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_unico_registro');
    }

    /**
     * Obtiene los datos de un informe
     */
    public function getInform(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_informes');
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
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_registros_consulta_principal');
    }

    /**
     * Obtiene registros combinados
     */
    public function getCombinedRecords(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_registros_combinados');
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
        return $this->storedProcedureService->executeProcedure($request, 'p_registrar_registros');
    }

    /**
     * Obtiene los campos del esquema
     */
    public function getRegisterFields(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_campos_registros');
    }

    /**
     * Obtiene los registros
     */
    public function getRegisterRecords(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_registros');
    }

    /**
     * Obtiene los filtros en formato JSON
     */
    public function getFiltersJson(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_filtros_json');
    }

    /**
     * Obtiene los datos de los activos
     */
    public function getActiveData(Request $request)
    {
        return $this->storedProcedureService->executeProcedure($request, 'p_traer_activos');
    }
}

