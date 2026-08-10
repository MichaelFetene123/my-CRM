<?php

namespace App\Actions\Leads;

use App\Models\Lead;
use DomainException;

class DiscardLead
{
    public function __invoke(Lead $lead, string $reason): Lead
    {
        if (!\in_array($lead->status, ['new', 'qualified'])) {
            throw new DomainException('Only new or qualified leads can be discarded.');
        }

        $lead->update([
            'status' => 'discarded',
            'discard_reason' => $reason,
        ]);

        return $lead;
    }
}