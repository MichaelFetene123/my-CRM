<?php

namespace App\Http\Controllers;

use App\Actions\Opportunities\MarkOpportunityLost;
use App\Actions\Opportunities\MarkOpportunityWon;
use App\Actions\Opportunities\MoveOpportunityStage;
use App\Actions\Opportunities\ReopenOpportunity;
use App\Http\Requests\MarkLostRequest;
use App\Http\Requests\MoveStageRequest;
use App\Http\Requests\StoreOpportunityRequest;
use App\Models\Contact;
use App\Models\Opportunity;
use App\Models\PipelineStage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OpportunityController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Opportunity::class);

        return Inertia::render('opportunities', [
            'stages' => Inertia::defer(fn () => PipelineStage::orderBy('order')->with(['opportunities.contact'])->get()),
            'contacts' => Contact::latest()->get(['id', 'name']),
        ]);
    }

    public function stages(): Response
    {
        Gate::authorize('viewAny', Opportunity::class);

        return Inertia::render('opportunities-stages');
    }

    public function apiIndex()
    {
        Gate::authorize('viewAny', Opportunity::class);

        return response()->json([
            'stages' => PipelineStage::orderBy('order')->with(['opportunities.contact'])->get(),
            'contacts' => Contact::latest()->get(['id', 'name']),
        ]);
    }

    public function store(StoreOpportunityRequest $request)
    {
        Gate::authorize('create', Opportunity::class);

        Opportunity::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'stage_entered_at' => now(),
        ]);

        return redirect()->route('opportunities.index');
    }

    public function apiStore(StoreOpportunityRequest $request)
    {
        Gate::authorize('create', Opportunity::class);

        $opportunity = Opportunity::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'stage_entered_at' => now(),
        ]);

        return response()->json($opportunity);
    }

    public function show(Opportunity $opportunity): Response
    {
        Gate::authorize('view', $opportunity);

        return Inertia::render('opportunities-show', [
            'opportunity' => $opportunity->load(['contact', 'stage', 'notes', 'activities']),
        ]);
    }

    public function apiShow(Opportunity $opportunity)
    {
        Gate::authorize('view', $opportunity);

        return response()->json($opportunity->load(['contact', 'stage', 'notes', 'activities']));
    }

    public function move(MoveStageRequest $request, Opportunity $opportunity, MoveOpportunityStage $action)
    {
        Gate::authorize('update', $opportunity);

        $newStage = PipelineStage::findOrFail($request->validated('stage_id'));
        $action($opportunity, $newStage);

        return redirect()->back();
    }

    public function apiMove(MoveStageRequest $request, Opportunity $opportunity, MoveOpportunityStage $action)
    {
        Gate::authorize('update', $opportunity);

        $newStage = PipelineStage::findOrFail($request->validated('stage_id'));
        $action($opportunity, $newStage);

        return response()->json(['success' => true]);
    }

    public function markWon(Opportunity $opportunity, MarkOpportunityWon $action)
    {
        Gate::authorize('update', $opportunity);

        $action($opportunity);

        return redirect()->back();
    }

    public function apiMarkWon(Opportunity $opportunity, MarkOpportunityWon $action)
    {
        Gate::authorize('update', $opportunity);

        $action($opportunity);

        return response()->json(['success' => true]);
    }

    public function markLost(MarkLostRequest $request, Opportunity $opportunity, MarkOpportunityLost $action)
    {
        Gate::authorize('update', $opportunity);

        $action($opportunity, $request->validated('reason'));

        return redirect()->back();
    }

    public function apiMarkLost(MarkLostRequest $request, Opportunity $opportunity, MarkOpportunityLost $action)
    {
        Gate::authorize('update', $opportunity);

        $action($opportunity, $request->validated('reason'));

        return response()->json(['success' => true]);
    }

    public function reopen(Opportunity $opportunity, ReopenOpportunity $action)
    {
        Gate::authorize('update', $opportunity);

        $action($opportunity);

        return redirect()->back();
    }

    public function apiReopen(Opportunity $opportunity, ReopenOpportunity $action)
    {
        Gate::authorize('update', $opportunity);

        $action($opportunity);

        return response()->json(['success' => true]);
    }

    public function destroy(Opportunity $opportunity)
    {
        Gate::authorize('delete', $opportunity);

        DB::transaction(function () use ($opportunity) {
            $opportunity->notes()->delete();
            $opportunity->activities()->delete();
            $opportunity->delete();
        });

        return redirect()->route('opportunities.index');
    }

    public function apiDestroy(Opportunity $opportunity)
    {
        Gate::authorize('delete', $opportunity);

        DB::transaction(function () use ($opportunity) {
            $opportunity->notes()->delete();
            $opportunity->activities()->delete();
            $opportunity->delete();
        });

        return response()->noContent();
    }
}
