<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Contact;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function apiIndex(Request $request)
    {
        $query = $request->input('q');
        $results = [];

        if (!$query) {
            return response()->json($results);
        }

        $user = $request->user();

        // If Super Admin, they have all permissions implicitly based on Policies, but hasPermission might not return true for them if not explicitly assigned.
        // Let's use the same logic as Policy: $user->hasRole('Super Admin') or $user->hasPermission(...)
        $isSuperAdmin = $user->hasRole('Super Admin');

        if ($isSuperAdmin || $user->hasPermission('contacts.view')) {
            $contacts = Contact::where('name', 'like', "%{$query}%")
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
            $leads = Lead::where('name', 'like', "%{$query}%")
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
            $opportunities = Opportunity::where('title', 'like', "%{$query}%")
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
            $activities = Activity::with('entity')
                ->where('type', 'like', "%{$query}%")
                ->limit(5)
                ->get()
                ->map(function ($activity) {
                    $url = '#';
                    $entityName = 'Unknown';
                    if ($activity->entity) {
                        if ($activity->entity_type === Contact::class) {
                            $url = route('contacts.show', $activity->entity_id, false);
                            $entityName = $activity->entity->name;
                        } elseif ($activity->entity_type === Lead::class) {
                            $url = route('leads.show', $activity->entity_id, false);
                            $entityName = $activity->entity->name;
                        } elseif ($activity->entity_type === Opportunity::class) {
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

        return response()->json($results);
    }

    public function apiUsers(Request $request)
    {
        $query = $request->input('q');
        return response()->json(
            User::where('name', 'like', "%{$query}%")->limit(10)->get(['id', 'name'])
        );
    }
}
