<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;

Route::middleware('auth')->group(function () {

    Route::get('traerFiltros', [GeneralController::class, 'traerFiltros'])
        ->name('traerFiltros');

    Route::post('traerFiltros', [GeneralController::class, 'traerFiltros'])
        ->name('traerFiltros');

    Route::get('traerEncabezadoConsultas', [GeneralController::class, 'traerEncabezadoConsultas'])
        ->name('traerEncabezadoConsultas');

    Route::post('traerEncabezadoConsultas', [GeneralController::class, 'traerEncabezadoConsultas'])
        ->name('traerEncabezadoConsultas');

    Route::post('traerEncabezadoRegistros', [GeneralController::class, 'traerEncabezadoRegistros'])
        ->name('traerEncabezadoRegistros');

    Route::post('traerEncabezadoProcesos', [GeneralController::class, 'traerEncabezadoProcesos'])
        ->name('traerEncabezadoProcesos');

    Route::post('traerEncabezadoReportes', [GeneralController::class, 'traerEncabezadoReportes'])
        ->name('traerEncabezadoReportes');

    Route::get('traerEntidades', [GeneralController::class, 'traerEntidades'])
        ->name('traerEntidades');

    Route::post('traerEntidades', [GeneralController::class, 'traerEntidades'])
        ->name('traerEntidades');

    Route::get('traerLotesPagos', [GeneralController::class, 'traerLotesPagos'])
        ->name('traerLotesPagos');

    Route::post('traerLotesPagos', [GeneralController::class, 'traerLotesPagos'])
        ->name('traerEntidades');

    Route::get('traerUnicaEntidad', [GeneralController::class, 'traerUnicaEntidad'])
        ->name('traerUnicaEntidad');

    Route::post('traerUnicaEntidad', [GeneralController::class, 'traerUnicaEntidad'])
        ->name('traerUnicaEntidad');

    Route::get('traerDatosSesion', [GeneralController::class, 'traerDatosSesion'])
        ->name('traerDatosSesion');

});
