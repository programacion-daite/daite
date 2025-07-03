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
            'fields' => $this->executeProcedure([
                'procedure' => 'p_traer_campos_registros',
                'fields' => ['renglon' => $table],
            ]),
            'table' => $table,
            'primaryId' => $metadata['id_primario'],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $table = $data['table'];
        unset($data['table']);
        $keys = implode(',', array_keys($data));
        $values = implode(',', array_map(fn($v) => is_null($v) ? '' : $v, array_values($data)));
        $fields = [
            'json' => [
                'tabla' => $table,
                'campos' => $keys,
                'valores' => $values,
            ],
        ];
        $result = $this->executeProcedure([
            'procedure' => 'p_registrar_registros',
            'fields' => $fields,
        ]);

        if ($result[0]->codigo_estado === '200') {
            return redirect()->back()->with('result', $result);
        } else {
            info('adio, fue un error');
            return redirect()->back()
                ->withErrors([$result]);
        }
    }
}
