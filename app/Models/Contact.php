<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $company
 * @property string|null $email
 * @property string|null $phone
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Lead[] $leads
 * @property-read Collection|Opportunity[] $opportunities
 * @property-read Collection|Note[] $notes
 * @property-read Collection|Activity[] $activities
 */
class Contact extends Model
{
    protected $fillable = ['name', 'company', 'email', 'phone', 'status'];

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class);
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'entity');
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'entity');
    }
}
