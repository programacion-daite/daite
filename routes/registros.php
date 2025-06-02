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

    });

});
