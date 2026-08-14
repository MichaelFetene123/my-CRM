<?php

use App\Actions\Opportunities\MoveOpportunityStage;
use App\Models\Contact;
use App\Models\Opportunity;
use App\Models\PipelineStage;
use App\Models\User;
use Database\Seeders\PipelineStageSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('moves an open opportunity to a new stage', function () {
    $this->seed(PipelineStageSeeder::class);
    $user = User::factory()->create();
    $contact = Contact::create(['name' => 'John Doe', 'status' => 'prospect']);

    $stage1 = PipelineStage::where('order', 1)->first();
    $stage2 = PipelineStage::where('order', 2)->first();

    $opportunity = Opportunity::create([
        'contact_id' => $contact->id,
        'title' => 'Test Opp',
        'stage_id' => $stage1->id,
        'status' => 'open',
        'owner_id' => $user->id,
    ]);

    $result = (new MoveOpportunityStage)($opportunity, $stage2);

    expect($result->stage_id)->toBe($stage2->id);
    expect($result->notes()->count())->toBe(1);
    expect($result->notes()->first()->body)->toContain($stage1->name);
});

it('rejects moving a won or lost opportunity', function () {
    $this->seed(PipelineStageSeeder::class);
    $user = User::factory()->create();
    $contact = Contact::create(['name' => 'John Doe', 'status' => 'prospect']);

    $stage1 = PipelineStage::where('order', 1)->first();
    $stage2 = PipelineStage::where('order', 2)->first();

    $opportunity = Opportunity::create([
        'contact_id' => $contact->id,
        'title' => 'Test Opp',
        'stage_id' => $stage1->id,
        'status' => 'won',
        'owner_id' => $user->id,
    ]);

    (new MoveOpportunityStage)($opportunity, $stage2);
})->throws(DomainException::class);
