<?php

use App\Actions\Opportunities\MarkOpportunityWon;
use App\Models\Opportunity;
use App\Models\PipelineStage;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use DomainException;

uses(\Tests\TestCase::class, RefreshDatabase::class);

it('marks an open opportunity as won', function () {
    $this->seed(\Database\Seeders\PipelineStageSeeder::class);
    $user = User::factory()->create();
    $contact = Contact::create(['name' => 'John Doe', 'status' => 'prospect']);
    
    $stage1 = PipelineStage::where('order', 1)->first();

    $opportunity = Opportunity::create([
        'contact_id' => $contact->id,
        'title' => 'Test Opp',
        'stage_id' => $stage1->id,
        'status' => 'open',
        'owner_id' => $user->id,
    ]);

    $result = (new MarkOpportunityWon)($opportunity);

    expect($result->status)->toBe('won');
    expect($result->stage->is_won)->toBeTrue();
    expect($contact->fresh()->status)->toBe('customer');
    expect($result->notes()->count())->toBe(1);
});

it('rejects marking an already won or lost opportunity as won', function () {
    $this->seed(\Database\Seeders\PipelineStageSeeder::class);
    $user = User::factory()->create();
    $contact = Contact::create(['name' => 'John Doe', 'status' => 'prospect']);
    
    $stage1 = PipelineStage::where('order', 1)->first();

    $opportunity = Opportunity::create([
        'contact_id' => $contact->id,
        'title' => 'Test Opp',
        'stage_id' => $stage1->id,
        'status' => 'lost',
        'owner_id' => $user->id,
    ]);

    (new MarkOpportunityWon)($opportunity);
})->throws(DomainException::class);
