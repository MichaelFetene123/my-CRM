<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
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
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'source' => fake()->word(),
            'status' => fake()->randomElement(['new', 'qualified', 'converted', 'discarded']),
            'discard_reason' => null,
            'owner_id' => User::factory(),
        ];
    }
}
