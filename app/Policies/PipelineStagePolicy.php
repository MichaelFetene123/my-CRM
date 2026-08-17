<?php

namespace App\Policies;

use App\Models\PipelineStage;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PipelineStagePolicy
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

    public function view(User $user, PipelineStage $pipelineStage): bool
    {
        return $user->hasPermission('opportunities.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('opportunities.update');
    }

    public function update(User $user, PipelineStage $pipelineStage): bool
    {
        return $user->hasPermission('opportunities.update');
    }

    public function delete(User $user, PipelineStage $pipelineStage): bool
    {
        return $user->hasPermission('opportunities.update');
    }
}
