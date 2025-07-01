<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

trait ExecuteProcedureTrait
{
    /**
     * Default schema to use if none is provided.
     */
    protected string $defaultSchema = 'dbo';

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
     * Execute a stored procedure based on the given payload.
     *
     * @param  array  $payload
     *     Expected structure:
     *     [
     *         'return_data' => '0' | '1',  // default:1
     *         'schema'      => 'optional_schema', // optional
     *         'procedure'   => 'procedure_name',
     *         'fields'      => [
     *             'param1'  => 'value1',
     *         ],
     *     ]
     *
     * @return mixed
     *
     * @throws \InvalidArgumentException
     */
    public function executeProcedure(array $payload)
    {
        // 1. Validate payload
        $this->validatePayload($payload);

        $returnData = (int) ($payload['return_data'] ?? '1');
        $schema = $payload['schema'] ?? $this->defaultSchema;
        $procedure = $payload['procedure'];
        $fields = $payload['fields'] ?? [];

        // 2. Build parameter placeholders and bindings
        //    e.g. ['@param1 = ?', '@param2 = ?']  =>  '@param1 = ?, @param2 = ?'
        $placeholders = '';
        $bindings = [];

        if (!empty($fields)) {
            $placeholders = collect($fields)
                ->keys()
                ->map(fn(string $key) => "@{$key} = ?")
                ->implode(', ');

            $bindings = array_map(function ($value) {

                // Si es null, pasa a cadena vacía
                if (is_null($value)) return '';

                // Si es un array, convierte a JSON
                if (is_array($value)) return json_encode($value);

                // Sino, devuelve el valor tal cual
                return $value;
            }, array_values($fields));
        }

        // 3. Build the full EXEC string
        //  e.g. EXEC [schema].[procedure] @param1 = ?, @param2 = ?
        $exec = sprintf(
            'SET NOCOUNT ON; EXEC [%s].[%s] %s',
            $schema,
            $procedure,
            $placeholders,
        );

        // 4. Execute using the appropriate DB method
        $connection = DB::connection('tenant');

        if ($returnData === 1) {
            // Expecting result set
            return $connection->select($exec, $bindings);
        }

        // No data returned
        return $connection->statement($exec, $bindings);
    }

    /**
     * Basic payload validation.
     *
     * @param  array  $payload
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    protected function validatePayload(array $payload): void
    {
        $procedure = $payload['procedure'];
        if (!isset($procedure) || !is_string($procedure)) {
            throw new InvalidArgumentException('Invalid or missing "stored_procedure".');
        }

        if (!in_array($procedure, self::ALLOWED_PROCEDURES)) {
            throw new \Exception('Procedimiento no permitido');
        }

        if (isset($payload['fields']) && !is_array($payload['fields'])) {
            throw new InvalidArgumentException('Invalid "fields". Must be an associative array.');
        }

        if (isset($payload['return_data']) && !in_array($payload['return_data'], ['0', '1'], true)) {
            throw new InvalidArgumentException('Invalid "return_data". Must be "0" or "1".');
        }

        if (isset($payload['schema']) && !is_string($payload['schema'])) {
            throw new InvalidArgumentException('"schema" must be a string if provided.');
        }
    }
}
