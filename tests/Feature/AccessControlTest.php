<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(\Database\Seeders\RbacSeeder::class);
});

it('assigns standard role on registration', function () {
    $response = $this->post('/register', [
        'name' => 'New User',
        'email' => 'new@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect('/dashboard');
    $user = User::where('email', 'new@example.com')->first();
    
    expect($user->hasRole('Restricted/Standard User'))->toBeTrue()
        ->and($user->hasRole('Super Admin'))->toBeFalse();
});

it('allows super admin to access user management', function () {
    $admin = User::where('email', 'admin@gmail.com')->first();
    
    $response = $this->actingAs($admin)->get('/admin/users');
    $response->assertStatus(200);
});

it('prevents standard users from accessing user management', function () {
    $user = User::factory()->create();
    $user->roles()->attach(Role::where('name', 'Restricted/Standard User')->first());

    $response = $this->actingAs($user)->get('/admin/users');
    $response->assertStatus(403);
});

it('prevents non-super-admins from assigning super admin role', function () {
    $managerRole = Role::create(['name' => 'Manager']);
    $managerRole->permissions()->attach(Permission::where('name', 'manage_users')->first());

    $manager = User::factory()->create();
    $manager->roles()->attach($managerRole);

    $targetUser = User::factory()->create();
    $superAdminRole = Role::where('name', 'Super Admin')->first();

    $response = $this->actingAs($manager)->post("/admin/users/{$targetUser->id}/roles", [
        'role_id' => $superAdminRole->id,
    ]);

    $response->assertSessionHasErrors(['role_id' => 'You cannot assign the Super Admin role.']);
    expect($targetUser->fresh()->hasRole('Super Admin'))->toBeFalse();
});

it('allows manager to assign standard roles', function () {
    $managerRole = Role::create(['name' => 'Manager']);
    $managerRole->permissions()->attach(Permission::where('name', 'manage_users')->first());

    $manager = User::factory()->create();
    $manager->roles()->attach($managerRole);

    $targetUser = User::factory()->create();
    $standardRole = Role::where('name', 'Restricted/Standard User')->first();

    $response = $this->actingAs($manager)->post("/admin/users/{$targetUser->id}/roles", [
        'role_id' => $standardRole->id,
    ]);

    $response->assertSessionHasNoErrors();
    expect($targetUser->fresh()->hasRole('Restricted/Standard User'))->toBeTrue();
});
