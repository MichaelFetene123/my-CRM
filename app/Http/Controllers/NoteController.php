<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;

class NoteController extends Controller
{
    public function store(StoreNoteRequest $request)
    {
        Note::create([
            ...$request->validated(),
            'is_system_generated' => false,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->back();
    }

    public function apiStore(StoreNoteRequest $request)
    {
        $note = Note::create([
            ...$request->validated(),
            'is_system_generated' => false,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($note);
    }

    public function apiIndex()
    {
        $notes = Note::with(['entity', 'creator'])
            ->latest()
            ->paginate(10);

        return response()->json($notes);
    }

    public function apiUpdate(UpdateNoteRequest $request, Note $note)
    {
        $note->update($request->validated());

        return response()->json($note);
    }

    public function apiDestroy(Note $note)
    {
        if ($note->is_system_generated) {
            abort(403, 'System generated notes cannot be deleted.');
        }

        $note->delete();

        return response()->noContent();
    }
}
