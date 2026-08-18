<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Spatie\Permission\Models\Permission;

class LeadApiUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_update_updates_database(): void
    {
        $user = User::factory()->create();
        
        $permission = Permission::firstOrCreate(['name' => 'leads.update']);
        $user->givePermissionTo($permission);

        $lead = Lead::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'source' => 'Old Source'
        ]);

        $response = $this->actingAs($user)->put('/api/leads/' . $lead->id, [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'source' => 'New Source'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'name' => 'New Name',
            'email' => 'new@example.com',
            'source' => 'New Source'
        ]);
    }
}
