<?php

namespace App\Http\Controllers;

use App\Actions\Opportunities\MarkOpportunityLost;
use App\Actions\Opportunities\MarkOpportunityWon;
use App\Actions\Opportunities\MoveOpportunityStage;
use App\Http\Requests\MarkLostRequest;
use App\Http\Requests\MoveStageRequest;
use App\Http\Requests\StoreOpportunityRequest;
use App\Models\Opportunity;
use App\Models\PipelineStage;
use Inertia\Inertia;
use Inertia\Response;

class OpportunityController extends Controller
{
    public function index(): Response
    {
       return Inertia::render('opportunities', [
    'stages' => PipelineStage::orderBy('order')->with(['opportunities.contact'])->get(),
    'contacts' => \App\Models\Contact::latest()->get(['id', 'name']),
]);
    }

    public function store(StoreOpportunityRequest $request)
    {
        Opportunity::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'stage_entered_at' => now(),
        ]);

        return redirect()->route('opportunities.index');
    }

    public function show(Opportunity $opportunity): Response
    {
        return Inertia::render('opportunities-show', [
            'opportunity' => $opportunity->load(['contact', 'stage', 'notes', 'activities']),
        ]);
    }

    public function move(MoveStageRequest $request, Opportunity $opportunity, MoveOpportunityStage $action)
    {
        $newStage = PipelineStage::findOrFail($request->validated('stage_id'));
        $action($opportunity, $newStage);

        return redirect()->back();
    }

    public function markWon(Opportunity $opportunity, MarkOpportunityWon $action)
    {
        $action($opportunity);

        return redirect()->back();
    }

    public function markLost(MarkLostRequest $request, Opportunity $opportunity, MarkOpportunityLost $action)
    {
        $action($opportunity, $request->validated('reason'));

        return redirect()->back();
    }
}