<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\PipelineStage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'openPipeline' => Inertia::defer(fn () => [
                'count' => Opportunity::open()->count(),
            ]),
            'pipelineByStage' => Inertia::defer(fn () => PipelineStage::withCount(['opportunities' => fn ($q) => $q->where('status', 'open')])
                ->orderBy('order')
                ->get(['id', 'name', 'order'])
                ->map(fn ($stage) => ['name' => $stage->name, 'count' => $stage->opportunities_count])),
            'winRate' => Inertia::defer($this->winRate(...)),
            'overdueActivities' => Inertia::defer(Activity::overdue()->count(...)),
            'upcomingActivities' => Inertia::defer(Activity::whereNull('completed_at')
                ->whereBetween('due_at', [now(), now()->addWeek()])
                ->count(...)),
            'leadsBySource' => Inertia::defer(Lead::selectRaw('COALESCE(source, "Unknown") as source, COUNT(*) as count')
                ->groupBy('source')
                ->get(...)),
        ]);
    }

    private function winRate(): array
    {
        $won = Opportunity::where('status', 'won')->count();
        $lost = Opportunity::where('status', 'lost')->count();
        $total = $won + $lost;

        return [
            'won' => $won,
            'lost' => $lost,
            'rate' => $total > 0 ? round(($won / $total) * 100, 1) : 0,
        ];
    }
}
