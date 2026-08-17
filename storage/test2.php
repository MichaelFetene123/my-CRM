<?php
$user = App\Models\User::first();
\Illuminate\Support\Facades\Auth::login($user);
$query = 'test';
$isSuperAdmin = $user->hasRole('Super Admin');
$results = [];

if ($isSuperAdmin || $user->hasPermission('contacts.view')) {
    $contacts = App\Models\Contact::where('name', 'like', "%{$query}%")
        ->orWhere('company', 'like', "%{$query}%")
        ->orWhere('email', 'like', "%{$query}%")
        ->limit(5)
        ->get()
        ->map(fn ($contact) => [
            'id' => $contact->id,
            'type' => 'contact',
            'title' => $contact->name,
            'subtitle' => $contact->company ?? $contact->email,
            'url' => route('contacts.show', $contact, false),
        ]);
    if ($contacts->isNotEmpty()) {
        $results['Contacts'] = $contacts;
    }
}

if ($isSuperAdmin || $user->hasPermission('leads.view')) {
    $leads = App\Models\Lead::where('name', 'like', "%{$query}%")
        ->orWhere('email', 'like', "%{$query}%")
        ->limit(5)
        ->get()
        ->map(fn ($lead) => [
            'id' => $lead->id,
            'type' => 'lead',
            'title' => $lead->name,
            'subtitle' => $lead->email,
            'url' => route('leads.show', $lead, false),
        ]);
    if ($leads->isNotEmpty()) {
        $results['Leads'] = $leads;
    }
}

if ($isSuperAdmin || $user->hasPermission('opportunities.view')) {
    $opportunities = App\Models\Opportunity::where('title', 'like', "%{$query}%")
        ->limit(5)
        ->get()
        ->map(fn ($opp) => [
            'id' => $opp->id,
            'type' => 'opportunity',
            'title' => $opp->title,
            'subtitle' => $opp->value ? '$' . number_format($opp->value, 2) : 'No value',
            'url' => route('opportunities.show', $opp, false),
        ]);
    if ($opportunities->isNotEmpty()) {
        $results['Opportunities'] = $opportunities;
    }
}

if ($isSuperAdmin || $user->hasPermission('activities.view')) {
    $activities = App\Models\Activity::with('entity')
        ->where('type', 'like', "%{$query}%")
        ->limit(5)
        ->get()
        ->map(function ($activity) {
            $url = '#';
            $entityName = 'Unknown';
            if ($activity->entity) {
                if ($activity->entity_type === App\Models\Contact::class) {
                    $url = route('contacts.show', $activity->entity_id, false);
                    $entityName = $activity->entity->name;
                } elseif ($activity->entity_type === App\Models\Lead::class) {
                    $url = route('leads.show', $activity->entity_id, false);
                    $entityName = $activity->entity->name;
                } elseif ($activity->entity_type === App\Models\Opportunity::class) {
                    $url = route('opportunities.show', $activity->entity_id, false);
                    $entityName = $activity->entity->title;
                }
            }
            
            return [
                'id' => $activity->id,
                'type' => 'activity',
                'title' => ucfirst($activity->type) . ' (' . $entityName . ')',
                'subtitle' => 'Due: ' . $activity->due_at->format('M d, Y'),
                'url' => $url,
            ];
        });
    if ($activities->isNotEmpty()) {
        $results['Activities'] = $activities;
    }
}

echo json_encode($results);
