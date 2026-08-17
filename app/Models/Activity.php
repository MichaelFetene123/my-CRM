<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $entity_type
 * @property int $entity_id
 * @property string $type
 * @property Carbon $due_at
 * @property Carbon|null $completed_at
 * @property int $owner_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Model $entity
 * @property-read User $owner
 */
class Activity extends Model
{
    use HasFactory;

    protected $fillable = ['entity_type', 'entity_id', 'type', 'due_at', 'completed_at', 'owner_id'];

    protected $casts = [
        'due_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function entity(): MorphTo
    {
        return $this->morphTo();
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('due_at', '<', now())->whereNull('completed_at');
    }
}
