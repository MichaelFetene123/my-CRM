<?php

namespace Database\Seeders;

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

        $contacts = \App\Models\Contact::factory(10)->create();
        
        \App\Models\Lead::factory(10)
            ->recycle($user)
            ->recycle($contacts)
            ->create();

        \App\Models\Opportunity::factory(10)
            ->recycle($user)
            ->recycle($contacts)
            ->create();

        \App\Models\Activity::factory(10)
            ->recycle($user)
            ->recycle($contacts)
            ->create();
    }
}
