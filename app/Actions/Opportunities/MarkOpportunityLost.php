<?php

namespace App\Actions\Opportunities;

use App\Models\Opportunity;
use App\Models\PipelineStage;
use DomainException;
use Illuminate\Support\Facades\DB;

class MarkOpportunityLost
{
    public function __invoke(Opportunity $opportunity, string $reason): Opportunity
    {
        if ($opportunity->status !== 'open') {
            throw new DomainException('Only open opportunities can be marked Lost.');
        }

        return DB::transaction(function () use ($opportunity, $reason) {
            $lostStage = PipelineStage::where('is_lost', true)->firstOrFail();

            $opportunity->update([
                'status' => 'lost',
                'stage_id' => $lostStage->id,
                'lost_reason' => $reason,
                'stage_entered_at' => now(),
            ]);

            $opportunity->notes()->create([
                'body' => "Opportunity marked as Lost: {$reason}",
                'is_system_generated' => true,
                'created_by' => $opportunity->owner_id,
            ]);

            return $opportunity;
        });
    }
}
