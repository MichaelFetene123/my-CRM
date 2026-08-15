<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Contact::class);

        return Inertia::render('Contacts/Index', [
            'contacts' => Inertia::defer(fn () => Contact::latest()->paginate(20)),
        ]);
    }

    public function apiIndex()
    {
        Gate::authorize('viewAny', Contact::class);

        return response()->json(Contact::latest()->paginate(20));
    }

    public function store(StoreContactRequest $request)
    {
        Gate::authorize('create', Contact::class);

        Contact::create($request->validated());

        return redirect()->route('contacts.index');
    }

    public function show(Contact $contact): Response
    {
        Gate::authorize('view', $contact);

        return Inertia::render('Contacts/Show', [
            'contact' => $contact->load(['leads', 'opportunities', 'notes', 'activities']),
        ]);
    }

    public function apiShow(Contact $contact)
    {
        Gate::authorize('view', $contact);

        return response()->json($contact->load(['leads', 'opportunities', 'notes', 'activities']));
    }

    public function update(StoreContactRequest $request, Contact $contact)
    {
        Gate::authorize('update', $contact);

        $contact->update($request->validated());

        return redirect()->back();
    }

    public function destroy(Contact $contact)
    {
        Gate::authorize('delete', $contact);

        $contact->delete();

        return redirect()->route('contacts.index');
    }
}
