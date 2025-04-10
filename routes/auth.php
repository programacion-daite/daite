<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {

    Route::get('/register', function () {
        abort(404);
    })->name('register');

    Route::get('/passwordRequest', function () {
        abort(404);
    })->name(name: 'password.request');

    Route::get('/home', function () {
        abort(404);
    })->name('home');

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('login.store');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
