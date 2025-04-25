<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Services\SessionService;

class SessionController extends Controller
{

    protected $sessionService;

    /**
     * Constructor de la clase SessionController
     * @param SessionService $sessionService
     */
    public function __construct(SessionService $sessionService)
    {
        $this->sessionService = $sessionService;
    }


    /**
     * Obtiene los datos de la sesión del usuario
     * @param Request $request
     * @return array
     */
    public function obtenerDatosSesion(Request $request)
    {
        return $this->sessionService->obtenerDatosSesion($request);
    }


}