<?php

use App\Actions\Leads\ConvertLeadToOpportunity;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(\Tests\TestCase::class, RefreshDatabase::class);

it('converts a new lead into an opportunity', function () {
    $this->seed(\Database\Seeders\PipelineStageSeeder::class);
    $user = User::factory()->create();
    $lead = Lead::create(['name' => 'Jane Deal', 'status' => 'new', 'owner_id' => $user->id]);

    $opportunity = (new ConvertLeadToOpportunity)($lead, 'Jane Deal - Q1');

    expect($opportunity->title)->toBe('Jane Deal - Q1');
    expect($lead->fresh()->status)->toBe('converted');
    expect($opportunity->notes()->count())->toBe(1);
});

it('rejects converting an already-converted lead', function () {
    $this->seed(\Database\Seeders\PipelineStageSeeder::class);
    $user = User::factory()->create();
    $lead = Lead::create(['name' => 'Jane Deal', 'status' => 'converted', 'owner_id' => $user->id]);

    (new ConvertLeadToOpportunity)($lead, 'Jane Deal - Q1');
})->throws(\DomainException::class);

it('links to an existing contact found by email instead of creating a duplicate', function () {
    $this->seed(\Database\Seeders\PipelineStageSeeder::class);
    $user = User::factory()->create();
    $existingContact = \App\Models\Contact::create(['name' => 'Old Name', 'email' => 'jane@acme.com']);
    $lead = Lead::create(['name' => 'Jane Deal', 'email' => 'jane@acme.com', 'status' => 'new', 'owner_id' => $user->id]);

    $opportunity = (new ConvertLeadToOpportunity)($lead, 'Jane Deal - Q1');

    expect($opportunity->contact_id)->toBe($existingContact->id);
    expect(\App\Models\Contact::count())->toBe(1); // no duplicate created
});
