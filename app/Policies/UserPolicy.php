<?php

namespace App\Policies;

use App\Models\User as UserModel;
use App\Models\User;

class UserPolicy
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
        return $user->hasPermission('users.view');
    }

    public function view(User $user, UserModel $model): bool
    {
        return $user->hasPermission('users.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('users.create');
    }

    public function update(User $user, UserModel $model): bool
    {
        return $user->hasPermission('users.update');
    }

    public function delete(User $user, UserModel $model): bool
    {
        return $user->hasPermission('users.delete');
    }
}
