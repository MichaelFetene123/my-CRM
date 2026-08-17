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

    public function apiStore(StoreLeadRequest $request)
    {
        Gate::authorize('create', Lead::class);

        $lead = Lead::create([...$request->validated(), 'owner_id' => $request->user()->id, 'status' => 'new']);

        return response()->json($lead);
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

    public function show(Lead $lead): Response
    {
        Gate::authorize('view', $lead);

        return Inertia::render('Leads/Show', [
            'lead' => $lead->load(['contact', 'owner']),
        ]);
    }

    public function apiShow(Lead $lead)
    {
        Gate::authorize('view', $lead);

        return response()->json($lead->load(['contact', 'owner']));
    }

    public function update(StoreLeadRequest $request, Lead $lead)
    {
        Gate::authorize('update', $lead);

        $lead->update($request->validated());

        return redirect()->back();
    }

    public function apiUpdate(StoreLeadRequest $request, Lead $lead)
    {
        Gate::authorize('update', $lead);

        $lead->update($request->validated());

        return response()->json($lead);
    }

    public function destroy(Lead $lead)
    {
        Gate::authorize('delete', $lead);

        $lead->delete();

        return redirect()->route('leads.index');
    }

    public function apiDestroy(Lead $lead)
    {
        Gate::authorize('delete', $lead);

        $lead->delete();

        return response()->json(['success' => true]);
    }
}
