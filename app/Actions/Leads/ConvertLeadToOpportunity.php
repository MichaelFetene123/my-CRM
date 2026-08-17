<?php

namespace App\Actions\Leads;

use App\Models\Contact;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\PipelineStage;
use DomainException;
use Illuminate\Support\Facades\DB;

class ConvertLeadToOpportunity
{
    public function __invoke(Lead $lead, string $title): Opportunity
    {
        if (! \in_array($lead->status, ['new', 'qualified'])) {
            throw new DomainException('Only new or qualified leads can be converted.');
        }

        if ($lead->opportunity()->exists()) {
            throw new DomainException('This lead has already been converted.');
        }

        return DB::transaction(function () use ($lead, $title) {
            $contact = $lead->contact_id
                ? $lead->contact
                : $this->findOrCreateContact($lead);

            $firstStage = PipelineStage::where('is_won', false)
                ->where('is_lost', false)
                ->orderBy('order')
                ->firstOrFail();

            $opportunity = Opportunity::create([
                'contact_id' => $contact->id,
                'lead_id' => $lead->id,
                'title' => $title,
                'stage_id' => $firstStage->id,
                'status' => 'open',
                'stage_entered_at' => now(),
                'owner_id' => $lead->owner_id,
            ]);

            $lead->update(['status' => 'converted', 'contact_id' => $contact->id]);



            return $opportunity;
        });
    }

    private function findOrCreateContact(Lead $lead): Contact
    {
        $existing = null;

        if ($lead->email) {
            $existing = Contact::where('email', $lead->email)->first();
        }

        if (! $existing) {
            $existing = Contact::where('name', $lead->name)->first();
        }

        return $existing ?? Contact::create([
            'name' => $lead->name,
            'email' => $lead->email,
            'status' => 'prospect',
        ]);
    }
}
