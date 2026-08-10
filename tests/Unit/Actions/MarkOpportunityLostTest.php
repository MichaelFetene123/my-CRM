<?php

use App\Actions\Opportunities\MarkOpportunityLost;
use App\Models\Opportunity;
use App\Models\PipelineStage;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use DomainException;

uses(\Tests\TestCase::class, RefreshDatabase::class);

it('marks an open opportunity as lost', function () {
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

    $result = (new MarkOpportunityLost)($opportunity, 'Price too high');

    expect($result->status)->toBe('lost');
    expect($result->stage->is_lost)->toBeTrue();
    expect($result->lost_reason)->toBe('Price too high');
    expect($result->notes()->count())->toBe(1);
});
