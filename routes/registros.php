<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;

Route::middleware(['auth'])->group(function () {

    // Registros del sistema
    Route::prefix('registros')
        ->group(function () {

        Route::get('beneficiarios', fn() => Inertia::render('registros/beneficiarios'))
        ->name('registros.beneficiarios');

        Route::get('beneficiarios', fn() => Inertia::render('registros/beneficiarios'))
        ->name('registros.beneficiarios');

        Route::get('provincias', fn() => Inertia::render('registros/administracion/provincias'))
        ->name('registros.provincias');

        Route::get('actividades', fn() => Inertia::render('registros/administracion/actividades'))
        ->name('registros.actividades');

        Route::get('generos', fn() => Inertia::render('registros/administracion/generos'))
        ->name('registros.generos');

        Route::get('municipios', fn() => Inertia::render('registros/administracion/municipios'))
        ->name('registros.municipios');

        Route::get('distritos', fn() => Inertia::render('registros/administracion/distritos'))
        ->name('registros.distritos');

        Route::get('afps', fn() => Inertia::render('registros/afps'))
        ->name('registros.afps');

        Route::get('bancos', fn() => Inertia::render('registros/bancos'))
        ->name('registros.bancos');

        Route::get('areas', fn() => Inertia::render('registros/areas'))
        ->name('registros.areas');

        Route::get('argumentos', fn() => Inertia::render('registros/argumentos'))
        ->name('registros.argumentos');

        Route::get('garantias', fn() => Inertia::render('registros/garantias'))
        ->name('registros.garantias');

        Route::get('tiposNotas', fn() => Inertia::render('registros/tiposNotas'))
        ->name('registros.tiposNotas');

        Route::get('empresas', fn() => Inertia::render('registros/empresas'))
        ->name('registros.empresas');

        Route::get('billetes', fn() => Inertia::render('registros/billetes'))
        ->name('registros.billetes');

        Route::get('barrios', fn() => Inertia::render('registros/barrios'))
        ->name('registros.barrios');

        Route::get('estadosCiviles', fn() => Inertia::render('registros/estadosCiviles'))
        ->name('registros.estadosCiviles');

        Route::get('cajeros', fn() => Inertia::render('registros/cajeros'))
        ->name('registros.cajeros');

        Route::get('categorias', fn() => Inertia::render('registros/categorias'))
        ->name('registros.categorias');

        Route::get('especialidades', fn() => Inertia::render('registros/especialidades'))
        ->name('registros.especialidades');

        Route::get('cobradores', fn() => Inertia::render('registros/cobradores'))
        ->name('registros.cobradores');

        Route::get('gestores', fn() => Inertia::render('registros/gestores'))
        ->name('registros.gestores');

        Route::get('tiposCargos', fn() => Inertia::render('registros/tiposCargos'))
        ->name('registros.tiposCargos');

        Route::get('monedas', fn() => Inertia::render('registros/monedas'))
        ->name('registros.monedas');

        Route::get('posiciones', fn() => Inertia::render('registros/posiciones'))
        ->name('registros.posiciones');

        Route::get('seguros', fn() => Inertia::render('registros/seguros'))
        ->name('registros.seguros');

        Route::get('tiposPermisos', fn() => Inertia::render('registros/tiposPermisos'))
        ->name('registros.tiposPermisos');

        Route::get('tiposTasas', fn() => Inertia::render('registros/tiposTasas'))
        ->name('registros.tiposTasas');

        Route::get('conceptos', fn() => Inertia::render('registros/conceptos'))
        ->name('registros.conceptos');

        Route::get('departamentos', fn() => Inertia::render('registros/departamentos'))
        ->name('registros.departamentos');

        Route::get('paises', fn() => Inertia::render('registros/paises'))
        ->name('registros.paises');

        Route::get('rutas', fn() => Inertia::render('registros/rutas'))
        ->name('registros.rutas');

        Route::get('tiposSeguiientos', fn() => Inertia::render('registros/tiposSeguimientos'))
        ->name('registros.tiposSeguimientos');

        Route::get('grupos', fn() => Inertia::render('registros/grupos'))
        ->name('registros.grupos');

        Route::get('renglones', fn() => Inertia::render('registros/renglones'))
        ->name('registros.renglones');

        Route::get('subCategorias', fn() => Inertia::render('registros/subCategorias'))
        ->name('registros.subCategorias');

        Route::get('supervisores', fn() => Inertia::render('registros/supervisores'))
        ->name('registros.supervisores');

        Route::get('tiposConstribuyentes', fn() => Inertia::render('registros/tiposConstribuyentes'))
        ->name('registros.tiposConstribuyentes');

        Route::get('tiposDocumentos', fn() => Inertia::render('registros/tiposDocumentos'))
        ->name('registros.tiposDocumentos');

        Route::get('tiposRelaciones', fn() => Inertia::render('registros/tiposRelaciones'))
        ->name('registros.tiposRelaciones');

        Route::get('clasificacionesContables', fn() => Inertia::render('registros/clasificacionesContables'))
        ->name('registros.clasificacionesContables');

        Route::get('tiposCalculos', fn() => Inertia::render('registros/tiposCalculos'))
        ->name('registros.tiposCalculos');

        Route::get('formasPagos', fn() => Inertia::render('registros/formasPagos'))
        ->name('registros.formasPagos');

        Route::get('oficiales', fn() => Inertia::render('registros/oficiales'))
        ->name('registros.oficiales');

        Route::get('marcas', fn() => Inertia::render('registros/marcas'))
        ->name('registros.marcas');

        Route::get('sectores', fn() => Inertia::render('registros/sectores'))
        ->name('registros.sectores');

        Route::get('sucursales', fn() => Inertia::render('registros/sucursales'))
        ->name('registros.sucursales');

        Route::get('tiposContactos', fn() => Inertia::render('registros/tiposContactos'))
        ->name('registros.tiposContactos');

        Route::get('tiposVehiculos', fn() => Inertia::render('registros/tiposVehiculos'))
        ->name('registros.tiposVehiculos');


    });

});
