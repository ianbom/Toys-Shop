<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class MidtransFinishController extends Controller
{
    public function __invoke(): RedirectResponse
    {
        return redirect()->route('my-order');
    }
}
