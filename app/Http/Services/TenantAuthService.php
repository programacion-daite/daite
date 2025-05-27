<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use App\Helpers\DynamicConnection;


class TenantAuthService
{
    /**
     * The name of the dynamic connection
     *
     * @var string
     */
    protected $connectionName = 'tenant';

    /**
     * Authenticate a user with the given credentials
     *
     * @param string $username
     * @param string $password
     * @param string|null $device
     * @param string $origin
     * @return array
     */
    public function authenticateUser($username, $password, $device = null, $origin = 'WEB')
    {

        $credentials = DB::select('EXEC [dbo].[p_traer_conexion_usuario_autenticar] ?, ?, ?, ?', [
            $username,
            $password,
            $device ?? request()->header('User-Agent'),
            $origin
        ]);

        $credentials = $credentials[0] ?? null;

        if (!$credentials || property_exists($credentials, 'error')) {
            return [
                'error' => true,
                'data' => $credentials
            ];
        }

        try {
            DynamicConnection::setConnection($credentials);
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

        // Use the new connection to find the user
        try {
            $usuarioModel = (new User)->setConnection($this->connectionName)
                ->where('usuario', $username)
                ->where('contrasena', $password)
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

        Session::put('conexion', $credentials);
        Session::put('usuario', $usuarioModel);

        return [
            'error' => false,
            'data' => $usuarioModel
        ];
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
