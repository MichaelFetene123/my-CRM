<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Collection;

/**
 * @property int $id
 * @property string $name
 * @property int $order
 * @property bool $is_won
 * @property bool $is_lost
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Opportunity[] $opportunities
 */
class PipelineStage extends Model
{
    protected $fillable = ['name', 'order', 'is_won', 'is_lost'];

    protected $casts = [
        'is_won' => 'boolean',
        'is_lost' => 'boolean',
    ];

    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class, 'stage_id');
    }
}