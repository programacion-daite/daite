<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\HandleDinamicConnections;

Route::middleware(['auth', HandleDinamicConnections::class])->group(function () {

    // Procesos del sistema
    Route::prefix('procesos')->group(function () {
        Route::get('lotesPagos', fn() => Inertia::render('procesos/lotesPagos'))
            ->name('procesos.lotesPagos');
    });

});
