<?php

use App\Models\Activity;
use App\Models\Contact;
use App\Models\Note;
use App\Models\Opportunity;
use App\Models\User;
use Database\Seeders\PipelineStageSeeder;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\seed;
use function Pest\Laravel\delete;

uses(RefreshDatabase::class);

beforeEach(function () {
    seed(RbacSeeder::class);
    seed(PipelineStageSeeder::class);
});

test('it deletes associated notes and activities when opportunity is deleted', function () {
    $admin = User::where('email', 'admin@gmail.com')->first();
    
    $contact = Contact::create(['name' => 'John Doe', 'email' => 'john@example.com']);

    $opportunity = Opportunity::create([
        'title' => 'Test Opp', 
        'amount' => 1000, 
        'stage_id' => 1, 
        'contact_id' => $contact->id, 
        'owner_id' => $admin->id, 
        'stage_entered_at' => now(),
    ]);

    $note = $opportunity->notes()->create([
        'body' => 'Test note',
        'created_by' => $admin->id,
    ]);

    $activity = $opportunity->activities()->create([
        'type' => 'call',
        'due_at' => now(),
        'owner_id' => $admin->id,
    ]);

    // Make sure they exist in the DB
    assertDatabaseHas('notes', ['id' => $note->id]);
    assertDatabaseHas('activities', ['id' => $activity->id]);
    assertDatabaseHas('opportunities', ['id' => $opportunity->id]);

    // Call the delete route
    actingAs($admin)->delete(route('opportunities.destroy', $opportunity))
        ->assertRedirect(route('opportunities.index'));

    // Assert they are deleted
    assertDatabaseMissing('opportunities', ['id' => $opportunity->id]);
    assertDatabaseMissing('notes', ['id' => $note->id]);
    assertDatabaseMissing('activities', ['id' => $activity->id]);
});
