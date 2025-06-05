<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;
use App\Http\Middleware\HandleDinamicConnections;

// Rutas generales para todas las pantallas
Route::middleware(['auth', HandleDinamicConnections::class])->group(function () {
    // Rutas de filtros y encabezados
    Route::post('filters', [GeneralController::class, 'getFilters'])
        ->name('filters');

    Route::post('filtersJson', [GeneralController::class, 'getFiltersJson'])
        ->name('filters.json');

    Route::post('query-header', [GeneralController::class, 'getQueryHeader'])
        ->name('query.header');

    Route::post('records-header', [GeneralController::class, 'getRecordsHeader'])
        ->name('records.header');

    Route::post('processes-header', [GeneralController::class, 'getProcessesHeader'])
        ->name('processes.header');

    Route::post('reports-header', [GeneralController::class, 'getReportsHeader'])
        ->name('reports.header');

    Route::post('get-active-data', [GeneralController::class, 'getActiveData'])
        ->name('get.active.data');

    // Rutas de entidades y registros
    Route::post('entities', [GeneralController::class, 'getEntities'])
        ->name('entities');

    Route::post('payment-batches', [GeneralController::class, 'getPaymentBatches'])
        ->name('payment.batches');

    Route::post('single-entity', [GeneralController::class, 'getSingleEntity'])
        ->name('single.entity');

    Route::post('get-inform', [GeneralController::class, 'getInform'])
        ->name('get.inform');

    // Rutas de esquema y consultas
    Route::match(['get', 'post'], 'schema', [GeneralController::class, 'getSchema'])
        ->name('schema');

    Route::get('get-register-fields', [GeneralController::class, 'getRegisterFields'])
        ->name('get.register.fields');

    Route::post('get-register-records', [GeneralController::class, 'getRegisterRecords'])
        ->name('get.register.records');

    Route::post('main-query-records', [GeneralController::class, 'getMainQueryRecords'])
        ->name('main.query.records');

    Route::post('options', [GeneralController::class, 'getOptions'])
        ->name('options');

    Route::post('combined-records', [GeneralController::class, 'getCombinedRecords'])
        ->name('combined.records');

    // Ruta de registro
    Route::post('register-records', [GeneralController::class, 'registerRecords'])
        ->name('register.records');

});
