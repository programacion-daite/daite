<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Utils\Helpers;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }


    public function checkSocio(Request $request,$cedula) {

        // $request->validate([
        //     'cedula' => 'required|string',
        // ]);

        $cedula = str_replace(['.', '-', ' '], '', $cedula);
        $fetch = new Request();

        $fetch->merge([
            'procedimiento' => 'p_traer_valor',
            'renglon' => 'TRAER_CODIGO',
            'valor_uno' => $cedula,
        ]);

       $response = Helpers::EjecutarProcedimiento($fetch);

        return $response;

    }

    /**
     * Check if a socio exists and fetch their information.
     *
     * @throws \Illuminate\Validation\ValidationException
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $cedula
     * @param string  $codigo
     * @throws \Illuminate\Validation\ValidationException
     */

    public function checkSocioExists(Request $request) {

        $request->merge([
            'cedula' => str_replace(['-', ' '], '', $request->cedula),
            'codigo' => str_replace(['-', ' '], '', $request->codigo),
        ]);
        
        $request->validate([
            'cedula' => 'required|string',
            'codigo' => 'required|string',
        ]);

        $request->merge([
            'procedimiento' => 'p_traer_valor',
            'renglon' => 'TRAER_CODIGO',
            'valor_uno' => $cedula,
        ]);

       $response = Helpers::EjecutarProcedimiento($fetch);

        return $response;

    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
