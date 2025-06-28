<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\UserConfigController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/test', function (Request $request) {
    return 'test';
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas para configuraciones del usuario
Route::middleware('auth')->group(function () {
    Route::prefix('user-config')->group(function () {
        Route::get('/', [UserConfigController::class, 'show'])->name('user-config.show');
        Route::post('/', [UserConfigController::class, 'update'])->name('user-config.update');
        Route::delete('/', [UserConfigController::class, 'reset'])->name('user-config.reset');
    });
});
