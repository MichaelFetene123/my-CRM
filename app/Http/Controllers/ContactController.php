<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Contacts/Index', [
            'contacts' => Inertia::defer(fn () => Contact::latest()->paginate(20)),
        ]);
    }

    public function store(StoreContactRequest $request)
    {
        Contact::create($request->validated());

        return redirect()->route('contacts.index');
    }

    public function show(Contact $contact): Response
    {
        return Inertia::render('Contacts/Show', [
            'contact' => $contact->load(['leads', 'opportunities', 'notes', 'activities']),
        ]);
    }

    public function update(StoreContactRequest $request, Contact $contact)
    {
        $contact->update($request->validated());

        return redirect()->back();
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('contacts.index');
    }
}
