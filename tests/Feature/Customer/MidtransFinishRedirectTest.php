<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('strips Midtrans finish query parameters before showing my orders', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('payments.midtrans.finish', [
            'order_id' => 'ORD-20260519-HEONQY',
            'status_code' => '200',
            'transaction_status' => 'settlement',
        ]))
        ->assertRedirect(route('my-order'));
});
