<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\HandleDinamicConnections;

Route::middleware(['auth', HandleDinamicConnections::class])->group(function () {

    // Reportes del sistema
    Route::prefix('reportes')->group(function () {
        Route::get('activos', fn() => Inertia::render('reportes/activos'))
            ->name('reportes.activos');
    });

    Route::prefix('reportes')->group(function () {
        Route::get('clientes', fn() => Inertia::render('reportes/clientes'))
            ->name('reportes.clientes');
    });

});
