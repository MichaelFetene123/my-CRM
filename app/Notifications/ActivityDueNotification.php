<?php

namespace App\Notifications;

use App\Models\Activity;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ActivityDueNotification extends Notification
{
    use Queueable;

    public function __construct(public Activity $activity) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $isOverdue = $this->activity->due_at->isPast();

        return [
            'activity_id' => $this->activity->id,
            'type' => $this->activity->type,
            'due_at' => $this->activity->due_at->toIso8601String(),
            'message' => $isOverdue
                ? "Overdue {$this->activity->type} was due {$this->activity->due_at->diffForHumans()}"
                : "Upcoming {$this->activity->type} due {$this->activity->due_at->diffForHumans()}",
        ];
    }
}
