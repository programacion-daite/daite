<?php

namespace App\Http\Controllers\procesos;

use App\Http\Controllers\Controller;
use App\Traits\ExecuteProcedureTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanRequestController extends Controller
{
    use ExecuteProcedureTrait;

    public function index(Request $request)
    {
        return Inertia::render('procesos/solicitudesPrestamos', []);
    }
}
