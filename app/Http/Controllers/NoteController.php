<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use Illuminate\Support\Facades\Gate;

class NoteController extends Controller
{
    public function store(StoreNoteRequest $request)
    {
        Gate::authorize('create', Note::class);

        Note::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return redirect()->back();
    }

    public function apiStore(StoreNoteRequest $request)
    {
        Gate::authorize('create', Note::class);

        $note = Note::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return response()->json($note);
    }

    public function apiIndex()
    {
        Gate::authorize('viewAny', Note::class);

        $notes = Note::with(['entity', 'creator'])
            ->latest()
            ->paginate(10);

        return response()->json($notes);
    }

    public function apiUpdate(UpdateNoteRequest $request, Note $note)
    {
        Gate::authorize('update', $note);

        $note->update($request->validated());

        return response()->json($note);
    }

    public function apiDestroy(Note $note)
    {
        Gate::authorize('delete', $note);

        $note->delete();

        return response()->noContent();
    }
}
