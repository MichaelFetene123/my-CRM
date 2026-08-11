<?php

namespace App\Console\Commands;

use App\Models\Activity;
use App\Notifications\ActivityDueNotification;
use Illuminate\Console\Command;

class SendActivityReminders extends Command
{
    protected $signature = 'crm:send-activity-reminders';
    protected $description = 'Notify owners of overdue and soon-due activities';

    public function handle(): void
    {
        $activities = Activity::whereNull('completed_at')
            ->where('due_at', '<=', now()->addHours(24))
            ->with('owner')
            ->get();

        foreach ($activities as $activity) {
            $activity->owner->notify(new ActivityDueNotification($activity));
        }

        $this->info("Sent {$activities->count()} activity reminders.");
    }
}
