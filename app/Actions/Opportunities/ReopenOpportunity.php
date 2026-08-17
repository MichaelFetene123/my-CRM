<?php

namespace App\Actions\Opportunities;

use App\Models\Opportunity;
use App\Models\PipelineStage;
use DomainException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReopenOpportunity
{
    public function __invoke(Opportunity $opportunity): Opportunity
    {
        if ($opportunity->status === 'open') {
            throw new DomainException('Only won or lost opportunities can be reopened.');
        }

        return DB::transaction(function () use ($opportunity) {
            $targetStage = PipelineStage::where('is_won', false)
                ->where('is_lost', false)
                ->orderBy('order')
                ->firstOrFail();

            $opportunity->update([
                'status' => 'open',
                'stage_id' => $targetStage->id,
                'lost_reason' => null,
                'stage_entered_at' => now(),
            ]);



            return $opportunity;
        });
    }
}
