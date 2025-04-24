<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;

// Aqui iran las rutas que son generales para todas las pantallas (traerFiltros y demas)
Route::middleware('auth')->group(function () {

    Route::post('traerFiltros', [GeneralController::class, 'traerFiltros'])
        ->name('traerFiltros');

    Route::post('traerEncabezadoConsultas', [GeneralController::class, 'traerEncabezadoConsultas'])
        ->name('traerEncabezadoConsultas');

    Route::post('traerEncabezadoRegistros', [GeneralController::class, 'traerEncabezadoRegistros'])
        ->name('traerEncabezadoRegistros');

    Route::post('traerEncabezadoProcesos', [GeneralController::class, 'traerEncabezadoProcesos'])
        ->name('traerEncabezadoProcesos');

    Route::post('traerEncabezadoReportes', [GeneralController::class, 'traerEncabezadoReportes'])
        ->name('traerEncabezadoReportes');

    Route::post('traerEntidades', [GeneralController::class, 'traerEntidades'])
        ->name('traerEntidades');

    Route::match(['get', 'post'],'traerLotesPagos', [GeneralController::class, 'traerLotesPagos'])
    ->name('traerEntidades');

    Route::post('traerLotesPagos', [GeneralController::class, 'traerLotesPagos'])
        ->name('traerEntidades');

    Route::post('traerUnicaEntidad', [GeneralController::class, 'traerUnicaEntidad'])
        ->name('traerUnicaEntidad');

    Route::get('traerDatosSesion', [GeneralController::class, 'traerDatosSesion'])
        ->name('traerDatosSesion');

    Route::match(['get', 'post'], 'esquema', [GeneralController::class, 'esquema'])
        ->name('esquema');

    Route::post('RegistrosConsultaPrincipal', [GeneralController::class, 'RegistrosConsultaPrincipal'])
        ->name('RegistrosConsultaPrincipal');

    Route::post('traerRegistrosCombinados', [GeneralController::class, 'traerRegistrosCombinados'])
        ->name('traerRegistrosCombinados');

    Route::post('registrarRegistros', [GeneralController::class, 'registrarRegistros'])
        ->name('registrarRegistros');

});
