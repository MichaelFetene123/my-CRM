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
            // Find a sensible previous stage from timeline history
            $latestStageNote = $opportunity->notes()
                ->where('body', 'like', 'Stage changed from % to %')
                ->latest()
                ->first();

            $targetStage = null;
            if ($latestStageNote) {
                // Extract the destination stage name from the note
                if (preg_match('/to (.+)$/', $latestStageNote->body, $matches)) {
                    $stageName = trim($matches[1]);
                    $targetStage = PipelineStage::where('name', $stageName)
                        ->where('is_won', false)
                        ->where('is_lost', false)
                        ->first();
                }
            }

            // Fallback to the first non-terminal stage
            if (! $targetStage) {
                $targetStage = PipelineStage::where('is_won', false)
                    ->where('is_lost', false)
                    ->orderBy('order')
                    ->firstOrFail();
            }

            $opportunity->update([
                'status' => 'open',
                'stage_id' => $targetStage->id,
                'lost_reason' => null,
                'stage_entered_at' => now(),
            ]);

            $opportunity->notes()->create([
                'body' => 'Opportunity reopened from Won/Lost',
                'is_system_generated' => true,
                'created_by' => Auth::id() ?? $opportunity->owner_id, // ensure there's a user if auth is available
            ]);

            return $opportunity;
        });
    }
}
