<?php

namespace App\Policies;

use App\Models\Opportunity;
use App\Models\User;

class OpportunityPolicy
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
        return $user->hasPermission('opportunities.view');
    }

    public function view(User $user, Opportunity $opportunity): bool
    {
        return $user->hasPermission('opportunities.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('opportunities.create');
    }

    public function update(User $user, Opportunity $opportunity): bool
    {
        return $user->hasPermission('opportunities.update');
    }

    public function delete(User $user, Opportunity $opportunity): bool
    {
        return $user->hasPermission('opportunities.delete');
    }
}
