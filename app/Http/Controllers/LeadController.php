<?php

namespace App\Http\Controllers;

use App\Actions\Leads\ConvertLeadToOpportunity;
use App\Actions\Leads\DiscardLead;
use App\Http\Requests\ConvertLeadRequest;
use App\Http\Requests\DiscardLeadRequest;
use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Leads/Index', [
            'leads' => Inertia::defer(fn () => Lead::active()->latest()->paginate(20)),
        ]);
    }

    public function store(StoreLeadRequest $request)
    {
        Lead::create([...$request->validated(), 'owner_id' => $request->user()->id, 'status' => 'new']);

        return redirect()->route('leads.index');
    }

    public function convert(ConvertLeadRequest $request, Lead $lead, ConvertLeadToOpportunity $action)
    {
        $opportunity = $action($lead, $request->validated('title'));

        return redirect()->route('opportunities.show', $opportunity);
    }

    public function discard(DiscardLeadRequest $request, Lead $lead, DiscardLead $action)
    {
        $action($lead, $request->validated('reason'));

        return redirect()->route('leads.index');
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return redirect()->route('leads.index');
    }
}
