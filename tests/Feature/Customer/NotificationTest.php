<?php

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('marks a customer notification as read', function () {
    $user = User::factory()->create();
    $notification = Notification::query()->create([
        'user_id' => $user->id,
        'title' => 'Order update',
        'message' => 'Order has moved.',
        'type' => 'order',
        'is_read' => false,
    ]);

    $this->actingAs($user)
        ->post(route('notifications.read', $notification))
        ->assertRedirect();

    expect($notification->fresh()->is_read)->toBeTrue();
    expect($notification->fresh()->read_at)->not->toBeNull();
});

it('does not expose notification detail pages', function () {
    $user = User::factory()->create();
    $notification = Notification::query()->create([
        'user_id' => $user->id,
        'title' => 'Order update',
        'message' => 'Order has moved.',
        'type' => 'order',
        'is_read' => false,
    ]);

    $this->actingAs($user)
        ->get('/notifications/'.$notification->id)
        ->assertNotFound();
});
