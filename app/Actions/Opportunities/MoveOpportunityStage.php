<?php

namespace App\Actions\Opportunities;

use App\Models\Opportunity;
use App\Models\PipelineStage;
use Illuminate\Support\Facades\DB;
use DomainException;

class MoveOpportunityStage
{
    public function __invoke(Opportunity $opportunity, PipelineStage $newStage): Opportunity
    {
        if ($opportunity->status !== 'open') {
            throw new DomainException('Won or Lost opportunities cannot change stage.');
        }

        return DB::transaction(function () use ($opportunity, $newStage) {
            $oldStageName = $opportunity->stage->name;

            $opportunity->update([
                'stage_id' => $newStage->id,
                'stage_entered_at' => now(),
            ]);

            $opportunity->notes()->create([
                'body' => "Stage changed from {$oldStageName} to {$newStage->name}",
                'is_system_generated' => true,
                'created_by' => $opportunity->owner_id,
            ]);

            return $opportunity;
        });
    }
}