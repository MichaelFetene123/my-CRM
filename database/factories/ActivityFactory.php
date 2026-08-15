<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'entity_type' => Contact::class,
            'entity_id' => Contact::factory(),
            'type' => fake()->randomElement(['call', 'meeting', 'task', 'email']),
            'due_at' => fake()->dateTimeBetween('now', '+1 week'),
            'completed_at' => null,
            'owner_id' => User::factory(),
        ];
    }
}
