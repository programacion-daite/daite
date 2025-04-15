<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;

Route::get('/', fn() => redirect()->route('dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', fn() => Inertia::render('dashboard'))
        ->name('dashboard');


    Route::prefix('procesos')->group(function () {
        Route::get('lotesPagos', fn() => Inertia::render('procesos/lotesPagos'))
            ->name('lotesPagos');
    });

    Route::prefix('registros')->group(function () {
        Route::get('beneficiarios', fn() => Inertia::render('registros/beneficiarios'))
            ->name('beneficiarios');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/general.php';
require __DIR__.'/auth.php';
