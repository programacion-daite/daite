<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class TenantAuthService
{
    /**
     * The name of the dynamic connection
     *
     * @var string
     */
    protected $connectionName = 'sqlsrv';

    /**
     * Authenticate a user with the given credentials
     *
     * @param string $usuario
     * @param string $contrasena
     * @param string|null $dispositivo
     * @param string $origen
     * @return array
     */
    public function autenticarUsuario($usuario, $contrasena, $dispositivo = null, $origen = 'WEB')
    {

        $credenciales = DB::select('EXEC [dbo].[p_traer_conexion_usuario_autenticar] ?, ?, ?, ?', [
            $usuario,
            $contrasena,
            $dispositivo ?? request()->header('User-Agent'),
            $origen
        ]);

        $credenciales = $credenciales[0] ?? null;

        if (!$credenciales || property_exists($credenciales, 'error')) {
            return [
                'error' => true,
                'data' => $credenciales
            ];
        }

        try {
            $this->configurarConexionDinamica($credenciales);
        } catch (\Exception $e) {
            Log::error('Error configuring dynamic connection: ' . $e->getMessage());
            return [
                'error' => true,
                'data' => [
                    'mensaje' => 'Error al configurar la conexión a la base de datos',
                    'codigo_estado' => 500
                ]
            ];
        }

        // Ahora usar la nueva conexión para buscar al usuario
        try {
            $usuarioModel = (new User)->setConnection($this->connectionName)
                ->where('usuario', $usuario)
                ->where('contrasena', $contrasena)
                ->first();
        } catch (QueryException $e) {
            Log::error('Database connection error: ' . $e->getMessage());
            return [
                'error' => true,
                'data' => [
                    'mensaje' => 'Error de conexión a la base de datos',
                    'codigo_estado' => 500
                ]
            ];
        }

        if (!$usuarioModel) {
            return [
                'error' => true,
                'data' => [
                    'mensaje' => '¡El Usuario no existe!',
                    'campo' => 'usuario',
                    'codigo_estado' => 400
                ]
            ];
        }

        Auth::login($usuarioModel);

        Session::put('conexion', $credenciales);
        Session::put('usuario', $usuarioModel);

        return [
            'error' => false,
            'data' => $usuarioModel
        ];
    }

    /**
     * Configure the dynamic database connection
     *
     * @param object $credenciales
     * @return void
     * @throws \Exception
     */
    protected function configurarConexionDinamica($credenciales)
    {
        // Validate required connection parameters
        $requiredParams = ['hospedaje', 'puerto', 'base_datos', 'usuario', 'contrasena'];
        foreach ($requiredParams as $param) {
            if (!property_exists($credenciales, $param) || empty($credenciales->$param)) {
                throw new \Exception("Missing required connection parameter: {$param}");
            }
        }

        // Set the connection configuration
        Config::set("database.connections.{$this->connectionName}.host", $credenciales->hospedaje);
        Config::set("database.connections.{$this->connectionName}.port", $credenciales->puerto);
        Config::set("database.connections.{$this->connectionName}.database", $credenciales->base_datos);
        Config::set("database.connections.{$this->connectionName}.username", $credenciales->usuario);
        Config::set("database.connections.{$this->connectionName}.password", $credenciales->contrasena);

        // Purge and reconnect to ensure the new configuration is used
        DB::purge($this->connectionName);
        DB::reconnect($this->connectionName);

        // Test the connection to ensure it works
        try {
            DB::connection($this->connectionName)->getPdo();
        } catch (\Exception $e) {
            throw new \Exception("Failed to establish database connection: " . $e->getMessage());
        }
    }

    /**
     * Set the connection name to use
     *
     * @param string $name
     * @return $this
     */
    public function setConnectionName($name)
    {
        $this->connectionName = $name;
        return $this;
    }
}
