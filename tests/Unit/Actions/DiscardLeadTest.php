<?php

use App\Actions\Leads\DiscardLead;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use DomainException;

uses(\Tests\TestCase::class, RefreshDatabase::class);

it('discards a new lead', function () {
    $user = User::factory()->create();
    $lead = Lead::create(['name' => 'Jane Deal', 'status' => 'new', 'owner_id' => $user->id]);

    $result = (new DiscardLead)($lead, 'Not interested');

    expect($result->status)->toBe('discarded');
    expect($result->discard_reason)->toBe('Not interested');
});

it('rejects discarding an already-discarded lead', function () {
    $user = User::factory()->create();
    $lead = Lead::create(['name' => 'Jane Deal', 'status' => 'discarded', 'owner_id' => $user->id]);

    (new DiscardLead)($lead, 'Not interested');
})->throws(DomainException::class);
