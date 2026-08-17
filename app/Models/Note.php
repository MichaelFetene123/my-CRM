<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $entity_type
 * @property int $entity_id
 * @property string $body
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Model $entity
 * @property-read User|null $creator
 */
class Note extends Model
{
    protected $fillable = ['entity_type', 'entity_id', 'body', 'created_by', 'mentioned_user_ids'];

    protected $casts = [
        'mentioned_user_ids' => 'array',
    ];

    public function entity(): MorphTo
    {
        return $this->morphTo();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
