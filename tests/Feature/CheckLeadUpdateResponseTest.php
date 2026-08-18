<?php

use App\Models\User;
use App\Models\Lead;
use function Pest\Laravel\actingAs;

it('checks the actual response of lead update', function () {
    $admin = User::factory()->create(['email' => 'admin@gmail.com']);
    $role = \App\Models\Role::firstOrCreate(['name' => 'Super Admin']);
    $admin->roles()->attach($role);
    $lead = Lead::factory()->create();
    
    $response = actingAs($admin, 'web')->putJson('/api/leads/' . $lead->id, [
        'name' => 'Updated Name Test',
        'email' => 'updated@test.com',
        'source' => 'Test Source'
    ]);
    
    // Dump the response status and content so we can see what's actually happening
    dump([
        'status' => $response->getStatusCode(),
        'content' => $response->getContent()
    ]);
    
    // Also dump if it actually changed in the db
    dump([
        'db_name' => $lead->fresh()->name
    ]);
});
