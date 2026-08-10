<?php

namespace App\Actions\Activities;

use App\Models\Activity;
use DomainException;

class CompleteActivity
{
    public function __invoke(Activity $activity): Activity
    {
        if ($activity->completed_at !== null) {
            throw new DomainException('Activity is already completed.');
        }

        $activity->update(['completed_at' => now()]);

        return $activity;
    }
}