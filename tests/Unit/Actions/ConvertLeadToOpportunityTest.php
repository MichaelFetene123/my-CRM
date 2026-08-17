<?php

use App\Actions\Leads\ConvertLeadToOpportunity;
use App\Models\Contact;
use App\Models\Lead;
use App\Models\User;
use Database\Seeders\PipelineStageSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('converts a new lead into an opportunity', function () {
    $this->seed(PipelineStageSeeder::class);
    $user = User::factory()->create();
    $lead = Lead::create(['name' => 'Jane Deal', 'status' => 'new', 'owner_id' => $user->id]);

    $opportunity = (new ConvertLeadToOpportunity)($lead, 'Jane Deal - Q1');

    expect($opportunity->title)->toBe('Jane Deal - Q1');
    expect($lead->fresh()->status)->toBe('converted');
    expect($opportunity->notes()->count())->toBe(1);
});

it('rejects converting an already-converted lead', function () {
    $this->seed(PipelineStageSeeder::class);
    $user = User::factory()->create();
    $lead = Lead::create(['name' => 'Jane Deal', 'status' => 'converted', 'owner_id' => $user->id]);

    (new ConvertLeadToOpportunity)($lead, 'Jane Deal - Q1');
})->throws(DomainException::class);

it('links to an existing contact found by email instead of creating a duplicate', function () {
    $this->seed(PipelineStageSeeder::class);
    $user = User::factory()->create();
    $existingContact = Contact::create(['name' => 'Old Name', 'email' => 'jane@acme.com']);
    $lead = Lead::create(['name' => 'Jane Deal', 'email' => 'jane@acme.com', 'status' => 'new', 'owner_id' => $user->id]);

    $opportunity = (new ConvertLeadToOpportunity)($lead, 'Jane Deal - Q1');

    expect($opportunity->contact_id)->toBe($existingContact->id);
    expect(Contact::count())->toBe(1); // no duplicate created
});
