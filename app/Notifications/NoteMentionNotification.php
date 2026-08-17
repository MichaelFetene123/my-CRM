<?php

namespace App\Notifications;

use App\Models\Note;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NoteMentionNotification extends Notification
{
    use Queueable;

    public function __construct(public Note $note) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $creatorName = $this->note->creator ? $this->note->creator->name : 'Someone';
        $entityType = class_basename($this->note->entity_type);
        
        return [
            'note_id' => $this->note->id,
            'message' => "{$creatorName} mentioned you in a note on {$entityType}.",
        ];
    }
}
