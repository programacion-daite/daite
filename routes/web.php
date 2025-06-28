<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

Route::get('/', fn() => redirect()->route('inicio'));

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('inicio', fn() => Inertia::render('dashboard'))
        ->name('inicio');

    Route::get('estadisticas', function () {
        $modules = DB::connection('tenant')->select("EXEC dbo.p_traer_registros_consulta_principal @origen_registros='modulos', @campos='id_modulo as valor, modulo as descripcion', @programa='' ");

        return Inertia::render('estadisticas', [
            'modules' => $modules
        ]);
    })->name('estadisticas');

    Route::get('test-select', function () {
        return Inertia::render('examples');
    })->name('test-select');

});

require __DIR__.'/settings.php';
require __DIR__.'/reportes.php';
require __DIR__.'/registros.php';
require __DIR__.'/procesos.php';
require __DIR__.'/general.php';
require __DIR__.'/auth.php';
