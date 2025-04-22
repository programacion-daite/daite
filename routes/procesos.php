<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {

    // Procesos del sistema
    Route::prefix('procesos')->group(function () {
        Route::get('lotesPagos', fn() => Inertia::render('procesos/lotesPagos'))
            ->name('procesos.lotesPagos');
    });

});
