<?php

namespace App\Actions\Opportunities;

use App\Models\Opportunity;
use App\Models\PipelineStage;
use Illuminate\Support\Facades\DB;
use DomainException;

class MarkOpportunityWon
{
    public function __invoke(Opportunity $opportunity): Opportunity
    {
        if ($opportunity->status !== 'open') {
            throw new DomainException('Only open opportunities can be marked Won.');
        }

        return DB::transaction(function () use ($opportunity) {
            $wonStage = PipelineStage::where('is_won', true)->firstOrFail();

            $opportunity->update([
                'status' => 'won',
                'stage_id' => $wonStage->id,
                'stage_entered_at' => now(),
            ]);

            $opportunity->contact->update(['status' => 'customer']);

            $opportunity->notes()->create([
                'body' => 'Opportunity marked as Won',
                'is_system_generated' => true,
                'created_by' => $opportunity->owner_id,
            ]);

            return $opportunity;
        });
    }
}