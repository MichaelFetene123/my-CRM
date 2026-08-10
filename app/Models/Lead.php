<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $contact_id
 * @property string $name
 * @property string|null $email
 * @property string|null $source
 * @property string $status
 * @property string|null $discard_reason
 * @property int $owner_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Contact|null $contact
 * @property-read Opportunity|null $opportunity
 * @property-read User $owner
 */
class Lead extends Model
{
   protected $fillable = ['contact_id', 'name', 'email', 'source', 'status', 'discard_reason', 'owner_id'];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function opportunity(): HasOne
    {
        return $this->hasOne(Opportunity::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', ['new', 'qualified']);
    }
}