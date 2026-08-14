<?php

use App\Actions\Activities\CompleteActivity;
use App\Models\Activity;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('completes a pending activity', function () {
    $user = User::factory()->create();
    $contact = Contact::create(['name' => 'John Doe', 'status' => 'prospect']);

    $activity = Activity::create([
        'entity_type' => Contact::class,
        'entity_id' => $contact->id,
        'type' => 'call',
        'due_at' => now()->addDay(),
        'owner_id' => $user->id,
    ]);

    $result = (new CompleteActivity)($activity);

    expect($result->completed_at)->not->toBeNull();
});

it('rejects completing an already-completed activity', function () {
    $user = User::factory()->create();
    $contact = Contact::create(['name' => 'John Doe', 'status' => 'prospect']);

    $activity = Activity::create([
        'entity_type' => Contact::class,
        'entity_id' => $contact->id,
        'type' => 'call',
        'due_at' => now()->addDay(),
        'completed_at' => now(),
        'owner_id' => $user->id,
    ]);

    (new CompleteActivity)($activity);
})->throws(DomainException::class);
