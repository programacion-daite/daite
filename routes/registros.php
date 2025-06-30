<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;

$genericos = [
    'areas' => ['tabla' => 'areas', 'id_primario'=>'id_area'],
    'provincias' => ['tabla' => 'provincias', 'id_primario'=>'id_provincia'],
    'actividades' => ['tabla' => 'actividades', 'id_primario'=>'id_actividad'],
    'distritos' => ['tabla' => 'distritos', 'id_primario'=>'id_distrito'],
    'generos' => ['tabla' => 'generos', 'id_primario'=>'id_genero'],
    'municipios' => ['tabla' => 'municipios', 'id_primario'=>'id_municipio'],
    'afps' => ['tabla' => 'afps', 'id_primario'=>'id_afp'],
    'argumentos' => ['tabla' => 'argumentos', 'id_primario'=>'id_argumento'],
    'bancos' => ['tabla' => 'bancos', 'id_primario'=>'id_banco'],
    'barrios' => ['tabla' => 'barrios', 'id_primario'=>'id_barrio'],
    'billetes' => ['tabla' => 'billetes', 'id_primario'=>'id_billete'],
    'cajeros' => ['tabla' => 'cajeros', 'id_primario'=>'id_cajero'],
    'categorias' => ['tabla' => 'categorias', 'id_primario'=>'id_categoria'],
    'clasificacionesContables' => ['tabla' => 'clasificaciones_contables', 'id_primario'=>'id_clasificacion_contable'],
    'cobradores' => ['tabla' => 'cobradores', 'id_primario'=>'id_cobrador'],
    'conceptos' => ['tabla' => 'conceptos', 'id_primario'=>'id_concepto'],
    'departamentos' => ['tabla' => 'departamentos', 'id_primario'=>'id_departamento'],
    'empresas' => ['tabla' => 'empresas', 'id_primario'=>'id_empresa'],
    'especialidades' => ['tabla' => 'especialidades', 'id_primario'=>'id_especialidad'],
    'estadosCiviles' => ['tabla' => 'estados_civiles', 'id_primario'=>'id_estado_civil'],
    'formasPagos' => ['tabla' => 'formas_pagos', 'id_primario'=>'id_forma_pago'],
    'garantias' => ['tabla' => 'garantias', 'id_primario'=>'id_garantia'],
    'gestores' => ['tabla' => 'gestores', 'id_primario'=>'id_gestor'],
    'grupos' => ['tabla' => 'grupos', 'id_primario'=>'id_grupo'],
    'marcas' => ['tabla' => 'marcas', 'id_primario'=>'id_marca'],
    'monedas' => ['tabla' => 'monedas', 'id_primario'=>'id_moneda'],
    'oficiales' => ['tabla' => 'oficiales', 'id_primario'=>'id_oficial'],
    'paises' => ['tabla' => 'paises', 'id_primario'=>'id_pais'],
    'posiciones' => ['tabla' => 'posiciones', 'id_primario'=>'id_posicion'],
    'renglones' => ['tabla' => 'renglones', 'id_primario'=>'id_renglon'],
    'rutas' => ['tabla' => 'rutas', 'id_primario'=>'id_ruta'],
    'sectores' => ['tabla' => 'sectores', 'id_primario'=>'id_sector'],
    'seguros' => ['tabla' => 'seguros', 'id_primario'=>'id_seguro'],
    'subCategorias' => ['tabla' => 'subcategorias', 'id_primario'=>'id_sub_categoria'],
    'sucursales' => ['tabla' => 'sucursales', 'id_primario'=>'id_sucursal'],
    'supervisores' => ['tabla' => 'supervisores', 'id_primario'=>'id_supervisor'],
    'tiposCalculos' => ['tabla' => 'tipos_calculos', 'id_primario'=>'id_tipo_calculo'],
    'tiposCargos' => ['tabla' => 'tipos_cargos', 'id_primario'=>'id_tipo_cargo'],
    'tiposConstribuyentes' => ['tabla' => 'tipos_constribuyentes', 'id_primario'=>'id_tipo_constribuyente'],
    'tiposContactos' => ['tabla' => 'tipos_contactos', 'id_primario'=>'id_tipo_contacto'],
    'tiposDocumentos' => ['tabla' => 'tipos_documentos', 'id_primario'=>'id_tipo_documento'],
    'tiposNotas' => ['tabla' => 'tipos_notas', 'id_primario'=>'id_tipo_nota'],
    'tiposPermisos' => ['tabla' => 'tipos_permisos', 'id_primario'=>'id_tipo_permiso'],
    'tiposRelaciones' => ['tabla' => 'tipos_relaciones', 'id_primario'=>'id_tipo_relacion'],
    'tiposSeguimientos' => ['tabla' => 'tipos_seguimientos', 'id_primario'=>'id_tipo_seguimiento'],
    'tiposTasas' => ['tabla' => 'tipos_tasas', 'id_primario'=>'id_tipo_tasa'],
    'tiposVehiculos' => ['tabla' => 'tipos_vehiculos', 'id_primario'=>'id_tipo_vehiculo'],
];

Route::middleware(['auth'])->group(function () use ($genericos) {

    // Registros del sistema
    Route::prefix('registros')->group(function () use ($genericos) {
        
        //? Registros genéricos
        foreach ($genericos as $key => $value) {
            Route::get(
                $key,
                fn() => Inertia::render('registros/genericos', $value)
            )->name('registros.'.$key);
        }

        Route::get('beneficiarios', fn() => Inertia::render('registros/beneficiarios'))
        ->name('registros.beneficiarios');
    });
});
