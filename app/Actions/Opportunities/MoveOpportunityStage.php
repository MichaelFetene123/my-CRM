<?php

namespace App\Actions\Opportunities;

use App\Models\Opportunity;
use App\Models\PipelineStage;
use DomainException;
use Illuminate\Support\Facades\DB;

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



            return $opportunity;
        });
    }
}
