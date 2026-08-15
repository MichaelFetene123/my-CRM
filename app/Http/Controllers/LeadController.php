<?php

namespace App\Http\Controllers;

use App\Actions\Leads\ConvertLeadToOpportunity;
use App\Actions\Leads\DiscardLead;
use App\Http\Requests\ConvertLeadRequest;
use App\Http\Requests\DiscardLeadRequest;
use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Lead::class);

        return Inertia::render('Leads/Index', [
            'leads' => Inertia::defer(fn () => Lead::active()->latest()->paginate(20)),
        ]);
    }

    public function apiIndex()
    {
        Gate::authorize('viewAny', Lead::class);

        return response()->json(Lead::active()->latest()->paginate(20));
    }

    public function store(StoreLeadRequest $request)
    {
        Gate::authorize('create', Lead::class);

        Lead::create([...$request->validated(), 'owner_id' => $request->user()->id, 'status' => 'new']);

        return redirect()->route('leads.index');
    }

    public function convert(ConvertLeadRequest $request, Lead $lead, ConvertLeadToOpportunity $action)
    {
        Gate::authorize('update', $lead);

        $opportunity = $action($lead, $request->validated('title'));

        return redirect()->route('opportunities.show', $opportunity);
    }

    public function apiConvert(ConvertLeadRequest $request, Lead $lead, ConvertLeadToOpportunity $action)
    {
        Gate::authorize('update', $lead);

        $opportunity = $action($lead, $request->validated('title'));

        return response()->json($opportunity);
    }

    public function discard(DiscardLeadRequest $request, Lead $lead, DiscardLead $action)
    {
        Gate::authorize('update', $lead);

        $action($lead, $request->validated('reason'));

        return redirect()->route('leads.index');
    }

    public function apiDiscard(DiscardLeadRequest $request, Lead $lead, DiscardLead $action)
    {
        Gate::authorize('update', $lead);

        $action($lead, $request->validated('reason'));

        return response()->json(['success' => true]);
    }

    public function destroy(Lead $lead)
    {
        Gate::authorize('delete', $lead);

        $lead->delete();

        return redirect()->route('leads.index');
    }
}
