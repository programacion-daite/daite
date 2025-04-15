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

    Route::get('traerEntidades', [GeneralController::class, 'traerEntidades'])
        ->name('traerEntidades');

    Route::post('traerEntidades', [GeneralController::class, 'traerEntidades'])
        ->name('traerEntidades');

    Route::get('traerUnicaEntidad', [GeneralController::class, 'traerUnicaEntidad'])
        ->name('traerUnicaEntidad');

    Route::post('traerUnicaEntidad', [GeneralController::class, 'traerUnicaEntidad'])
        ->name('traerUnicaEntidad');

    Route::get('traerDatosSesion', [GeneralController::class, 'traerDatosSesion'])
        ->name('traerDatosSesion');

});
