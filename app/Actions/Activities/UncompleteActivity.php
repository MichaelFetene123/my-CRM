<?php

namespace App\Actions\Activities;

use App\Models\Activity;
use DomainException;

class UncompleteActivity
{
    public function __invoke(Activity $activity): Activity
    {
        if ($activity->completed_at === null) {
            throw new DomainException('Activity is already uncompleted.');
        }

        $activity->update(['completed_at' => null]);

        return $activity;
    }
}
