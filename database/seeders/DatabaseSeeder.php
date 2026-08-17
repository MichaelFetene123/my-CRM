<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Contact;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        $this->call([
            RbacSeeder::class,
            PipelineStageSeeder::class,
        ]);

        $user = User::where('email', 'admin@gmail.com')->first() ?? User::factory()->create();

        $contacts = Contact::factory(10)->create();

        Lead::factory(10)
            ->recycle($user)
            ->recycle($contacts)
            ->create();

        Opportunity::factory(10)
            ->recycle($user)
            ->recycle($contacts)
            ->create();

        Activity::factory(10)
            ->recycle($user)
            ->recycle($contacts)
            ->create();
    }
}
