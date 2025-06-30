<?php

namespace App\Http\Controllers\registros;

use App\Http\Controllers\Controller;
use App\Http\Services\StoredProcedureService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecordsController extends Controller
{
    public function __construct(
        protected StoredProcedureService $storedProcedureService,
    ) {}

    public function dynamicRecords(Request $request)
    {
        $metadata = $request->route('metadata');
        $request->merge([
            'renglon' => $metadata['tabla'],
            'salida' => 'JSON_CON_ENCABEZADO',
        ]);
        $fields = $this->storedProcedureService->executeProcedure($request, 'p_traer_campos_registros');
        $dbResult = $this->storedProcedureService->executeProcedure($request, 'p_traer_registros');
        $dataString = json_decode($dbResult->getContent(), true)[0]['resultado'];
        $data = json_decode($dataString, true);

        return Inertia::render('registros/genericos', [
            'columns' => $data['encabezado'],
            'data' => $data['datos'],
            'fields' => $fields,
            'table' => $metadata['tabla'],
            'primaryId' => $metadata['id_primario'],
        ]);
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
}
