<?php

namespace App\Http\Controllers\registros;

use App\Http\Controllers\Controller;
use App\Traits\ExecuteProcedureTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecordsController extends Controller
{
    use ExecuteProcedureTrait;

    public function dynamicRecords(Request $request)
    {
        $metadata = $request->route('metadata');
        $table = $metadata['tabla'];
        $dbResult = $this->executeProcedure([
            'procedure' => 'p_traer_registros',
            'fields' => ['renglon' => $table, 'salida' => 'JSON_CON_ENCABEZADO'],
        ]);
        $data = json_decode($dbResult[0]->resultado, true);

        return Inertia::render('registros/genericos', [
            'columns' => $data['encabezado'],
            'data' => $data['datos'],
            'fields' => Inertia::defer(fn() => $this->executeProcedure([
                'procedure' => 'p_traer_campos_registros',
                'renglon' => $table,
            ])),
            'table' => $table,
            'primaryId' => $metadata['id_primario'],
        ]);
    }

    public function store(Request $request)
    {
        $fields = $request->all();
        return $this->executeProcedure([
            'procedure' => 'p_registrar_registros',
            'fields' => $fields,
        ]);
    }
}
