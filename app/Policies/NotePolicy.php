<?php

namespace App\Policies;

use App\Models\Note;
use App\Models\User;

class NotePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('notes.view');
    }

    public function view(User $user, Note $note): bool
    {
        return $user->hasPermission('notes.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('notes.create');
    }

    public function update(User $user, Note $note): bool
    {
        return $user->hasPermission('notes.update');
    }

    public function delete(User $user, Note $note): bool
    {
        return $user->hasPermission('notes.delete');
    }
}
