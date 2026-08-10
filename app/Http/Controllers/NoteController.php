<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
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
}