<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\Lead;
use App\Models\PipelineStage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Opportunity>
 */
class OpportunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contact_id' => Contact::factory(),
            'lead_id' => Lead::factory(),
            'title' => fake()->sentence(3),
            'stage_id' => PipelineStage::inRandomOrder()->first()?->id ?? 1,
            'status' => fake()->randomElement(['open', 'won', 'lost']),
            'lost_reason' => null,
            'stage_entered_at' => now(),
            'owner_id' => User::factory(),
        ];
    }
}
