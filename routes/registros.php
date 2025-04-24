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

        Route::get('distritos', fn() => Inertia::render('registros/administracion/distritos'))
        ->name('registros.distritos');

        Route::get('actividades', fn() => Inertia::render('registros/administracion/actividades'))
        ->name('registros.actividades');

        Route::get('generos', fn() => Inertia::render('registros/administracion/generos'))
        ->name('registros.generos');



    });

});
