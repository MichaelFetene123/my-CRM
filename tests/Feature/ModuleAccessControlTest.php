<?php

use App\Models\Activity;
use App\Models\Contact;
use App\Models\Lead;
use App\Models\Opportunity;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\PipelineStageSeeder;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\seed;
use function Pest\Laravel\withoutExceptionHandling;

uses(RefreshDatabase::class);

beforeEach(function () {
    seed(RbacSeeder::class);
    seed(PipelineStageSeeder::class);
});

it('allows super admin to perform all actions on all modules', function () {
    $admin = User::where('email', 'admin@gmail.com')->first();
    withoutExceptionHandling();

    // Create test resources
    $contact = Contact::create(['name' => 'John Doe', 'email' => 'john@example.com']);
    $lead = Lead::create(['name' => 'Test Lead', 'status' => 'new', 'owner_id' => $admin->id]);
    $opportunity = Opportunity::create(['title' => 'Test Opp', 'amount' => 1000, 'stage_id' => 1, 'contact_id' => $contact->id, 'owner_id' => $admin->id, 'stage_entered_at' => now()]);
    $activity = Activity::create(['title' => 'Test Activity', 'type' => 'call', 'due_at' => now(), 'owner_id' => $admin->id, 'entity_type' => Contact::class, 'entity_id' => $contact->id]);

    // View
    actingAs($admin)->get('/contacts')->assertStatus(200);
    actingAs($admin)->get('/leads')->assertStatus(200);

    // Actions (should not return 403)
    actingAs($admin)->post('/contacts', ['name' => 'Jane Smith', 'email' => 'jane@example.com'])->assertRedirect();
    actingAs($admin)->put("/contacts/{$contact->id}", ['name' => 'John Doe', 'email' => 'john2@example.com'])->assertRedirect();

    // Custom Actions
    actingAs($admin)->post("/leads/{$lead->id}/convert", ['title' => 'Test'])->assertRedirect();
    actingAs($admin)->post("/opportunities/{$opportunity->id}/move", ['stage_id' => 1])->assertRedirect();
    actingAs($admin)->post("/activities/{$activity->id}/complete")->assertRedirect();

    // Delete at the end to prevent cascading deletes from breaking other assertions
    actingAs($admin)->delete("/contacts/{$contact->id}")->assertRedirect();
});

it('allows standard user to view modules but blocks creation and updates', function () {
    $user = User::factory()->create();
    $user->roles()->attach(Role::where('name', 'Restricted/Standard User')->first());

    // Create test resources
    $contact = Contact::create(['name' => 'John Doe', 'email' => 'j2@example.com']);
    $lead = Lead::create(['name' => 'Test Lead 2', 'status' => 'new', 'owner_id' => $user->id]);
    $opportunity = Opportunity::create(['title' => 'Test Opp 2', 'amount' => 1000, 'stage_id' => 1, 'contact_id' => $contact->id, 'owner_id' => $user->id, 'stage_entered_at' => now()]);
    $activity = Activity::create(['title' => 'Test Activity 2', 'type' => 'call', 'due_at' => now(), 'owner_id' => $user->id, 'entity_type' => Contact::class, 'entity_id' => $contact->id]);

    // View is allowed
    actingAs($user)->get('/contacts')->assertStatus(200);
    actingAs($user)->get("/contacts/{$contact->id}")->assertStatus(200);
    actingAs($user)->get('/leads')->assertStatus(200);

    // Create is blocked
    actingAs($user)->post('/contacts', ['name' => 'Jane Smith', 'email' => 'jane@example.com'])->assertStatus(403);
    actingAs($user)->post('/leads', ['name' => 'New Lead', 'status' => 'new'])->assertStatus(403);

    // Update is blocked
    actingAs($user)->put("/contacts/{$contact->id}", ['name' => 'John Doe', 'email' => 'john2@example.com'])->assertStatus(403);

    // Delete is blocked
    actingAs($user)->delete("/contacts/{$contact->id}")->assertStatus(403);

    // Custom Actions are blocked
    actingAs($user)->post("/leads/{$lead->id}/convert", ['title' => 'Test'])->assertStatus(403);
    actingAs($user)->post("/opportunities/{$opportunity->id}/won")->assertStatus(403);
    actingAs($user)->post("/activities/{$activity->id}/complete")->assertStatus(403);
});
