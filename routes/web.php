<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GeneralController;

Route::get('/', fn() => redirect()->route('inicio'));

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('inicio', fn() => Inertia::render('dashboard'))
        ->name('inicio');

});

require __DIR__.'/settings.php';
require __DIR__.'/registros.php';
require __DIR__.'/procesos.php';
require __DIR__.'/general.php';
require __DIR__.'/auth.php';
