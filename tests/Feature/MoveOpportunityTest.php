<?php

namespace Tests\Feature;

use App\Models\Opportunity;
use App\Models\PipelineStage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MoveOpportunityTest extends TestCase
{
    use RefreshDatabase;

    public function test_move_opportunity_forward_and_backward()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('opportunities.update');
        
        $stage1 = PipelineStage::factory()->create(['order' => 1]);
        $stage2 = PipelineStage::factory()->create(['order' => 2]);

        $opp = Opportunity::factory()->create([
            'stage_id' => $stage1->id,
            'status' => 'open',
            'owner_id' => $user->id,
        ]);

        // Move forward
        $response1 = $this->actingAs($user)->postJson("/api/opportunities/{$opp->id}/move", [
            'stage_id' => $stage2->id,
        ]);
        
        $response1->assertSuccessful();
        $this->assertEquals($stage2->id, $opp->fresh()->stage_id);

        // Move backward
        $response2 = $this->actingAs($user)->postJson("/api/opportunities/{$opp->id}/move", [
            'stage_id' => $stage1->id,
        ]);
        
        if (!$response2->isSuccessful()) {
            echo "\n\nBACKWARD FAILED WITH STATUS: " . $response2->status() . "\n";
            echo "RESPONSE CONTENT: " . $response2->getContent() . "\n\n";
        }
        
        $response2->assertSuccessful();
    }
}
