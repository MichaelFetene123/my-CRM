<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
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
        return $user->hasPermission('contacts.view');
    }

    public function view(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contacts.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('contacts.create');
    }

    public function update(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contacts.update');
    }

    public function delete(User $user, Contact $contact): bool
    {
        return $user->hasPermission('contacts.delete');
    }
}
