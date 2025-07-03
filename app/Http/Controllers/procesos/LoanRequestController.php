<?php

namespace App\Http\Controllers\procesos;

use App\Http\Controllers\Controller;
use App\Traits\ExecuteProcedureTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanRequestController extends Controller
{
    use ExecuteProcedureTrait;

    public function index(Request $request)
    {
        $tiposCuenta = [
            ['id_tipo_cuenta'=>1, 'tipo_cuenta'=>'PRESTAMOS'],
            ['id_tipo_cuenta'=>2, 'tipo_cuenta'=>'PRESTAMOS EN DOLAR'],
        ];
        $tiposCredito = [
            ['id_tipo_credito'=>1, 'tipo_credito'=>'CONSUMO'],
            ['id_tipo_credito'=>2, 'tipo_credito'=>'COMERCIAL'],
        ];
        $tiposCalculo = [
            ['id_tipo_calculo'=>1, 'tipo_calculo'=>'INSOLUTO'],
            ['id_tipo_calculo'=>2, 'tipo_calculo'=>'SOLUTO'],
        ];
        $garantias = [
            ['id_garantia'=>1, 'garantia'=>'HIPOTECARIA'],
            ['id_garantia'=>2, 'garantia'=>'VEHICULOS'],
        ];
        $formasPago = [
            ['id_forma_pago'=>1, 'forma_pago'=>'MENSUAL'],
            ['id_forma_pago'=>2, 'forma_pago'=>'QUINCENAL'],
        ];
        $mediosPago = [
            ['id_medio_pago'=>1, 'medio_pago'=>'TRANSFERENCIA'],
            ['id_medio_pago'=>2, 'medio_pago'=>'CHEQUE'],
        ];
        $oficiales = [
            ['id_oficial'=>1, 'oficial'=>'MARTIN DE LA CRUZ'],
            ['id_oficial'=>2, 'oficial'=>'HIPOLITO DE LA CRUZ'],
        ];
        $cobradores = [
            ['id_cobrador'=>1, 'cobrador'=>'OFICINA'],
            ['id_cobrador'=>2, 'cobrador'=>'LUIS ORTEGA'],
        ];
        $necesidades = [
            ['id_necesidad'=>1, 'necesidad'=>'PARA COMPRAR SOLAR'],
            ['id_necesidad'=>2, 'necesidad'=>'PARA INVERTIR EN EL NEGOCIO'],
        ];

        return Inertia::render('procesos/solicitudesPrestamos', [
            'tipos_cuenta' => $tiposCuenta,
            'tipos_credito' => $tiposCredito,
            'tipos_calculo' => $tiposCalculo,
            'garantias' => $garantias,
            'formas_pago' => $formasPago,
            'medios_pago' => $mediosPago,
            'oficiales' => $oficiales,
            'cobradores' => $cobradores,
            'necesidades' => $necesidades,
        ]);
    }
}
