<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;

Route::get('/', fn() => redirect()->route('inicio'));

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('inicio', fn() => Inertia::render('dashboard'))
        ->name('inicio');

    Route::prefix('procesos')->group(function () {
        Route::get('lotesPagos', fn() => Inertia::render('procesos/lotesPagos'))
            ->name('procesos.lotesPagos');
    });

    Route::prefix('registros')->group(function () {
        Route::get('beneficiarios', fn() => Inertia::render('registros/beneficiarios'))
            ->name('beneficiarios');

        Route::get('provincias', fn() => Inertia::render('registros/provincias'))
        ->name('registros.provincias');

    });

});

require __DIR__.'/settings.php';
require __DIR__.'/general.php';
require __DIR__.'/auth.php';
