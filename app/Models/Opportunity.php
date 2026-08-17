<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $contact_id
 * @property int|null $lead_id
 * @property string $title
 * @property int $stage_id
 * @property string $status
 * @property string|null $lost_reason
 * @property Carbon|null $stage_entered_at
 * @property int $owner_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Contact $contact
 * @property-read Lead|null $lead
 * @property-read PipelineStage $stage
 * @property-read User $owner
 * @property-read Collection|Activity[] $activities
 * @property-read Collection|Note[] $notes
 */
class Opportunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_id', 'lead_id', 'title', 'stage_id',
        'status', 'lost_reason', 'stage_entered_at', 'owner_id',
    ];

    protected $casts = [
        'stage_entered_at' => 'datetime',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function stage(): BelongsTo
    {
        return $this->belongsTo(PipelineStage::class, 'stage_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'entity');
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'entity');
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', 'open');
    }
}
