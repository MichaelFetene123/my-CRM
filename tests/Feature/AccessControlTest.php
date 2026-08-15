<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{actingAs, post, seed};

uses(RefreshDatabase::class);

beforeEach(function () {
    seed(\Database\Seeders\RbacSeeder::class);
});

it('assigns standard role on registration', function () {
    $response = post('/register', [
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
    
    $response = actingAs($admin)->get('/admin/users');
    $response->assertStatus(200);
});

it('prevents standard users from accessing user management', function () {
    $user = User::factory()->create();
    $user->roles()->attach(Role::where('name', 'Restricted/Standard User')->first());

    $response = actingAs($user)->get('/admin/users');
    $response->assertStatus(403);
});

it('prevents non-super-admins from assigning super admin role', function () {
    $managerRole = Role::create(['name' => 'Manager']);
    $managerRole->permissions()->attach(Permission::where('name', 'manage_users')->first());

    $manager = User::factory()->create();
    $manager->roles()->attach($managerRole);

    $targetUser = User::factory()->create();
    $superAdminRole = Role::where('name', 'Super Admin')->first();

    $response = actingAs($manager)->post("/admin/users/{$targetUser->id}/roles", [
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

    $response = actingAs($manager)->post("/admin/users/{$targetUser->id}/roles", [
        'role_id' => $standardRole->id,
    ]);

    $response->assertSessionHasNoErrors();
    expect($targetUser->fresh()->hasRole('Restricted/Standard User'))->toBeTrue();
});

it('allows super admin to edit and delete roles', function () {
    $admin = User::where('email', 'admin@gmail.com')->first();
    $role = Role::create(['name' => 'Custom Role', 'description' => 'Test']);

    $response = actingAs($admin)->put("/admin/roles/{$role->id}", [
        'name' => 'Updated Role',
        'description' => 'Updated',
    ]);
    
    $response->assertSessionHasNoErrors();
    expect($role->fresh()->name)->toBe('Updated Role');

    $response = actingAs($admin)->delete("/admin/roles/{$role->id}");
    $response->assertSessionHasNoErrors();
    expect(Role::find($role->id))->toBeNull();
});

it('prevents deletion and modification of super admin role', function () {
    $admin = User::where('email', 'admin@gmail.com')->first();
    $superAdminRole = Role::where('name', 'Super Admin')->first();

    $response = actingAs($admin)->put("/admin/roles/{$superAdminRole->id}", [
        'name' => 'Hacked Admin',
    ]);
    
    $response->assertSessionHasErrors(['role' => 'Cannot modify Super Admin directly.']);
    expect($superAdminRole->fresh()->name)->toBe('Super Admin');

    $response = actingAs($admin)->delete("/admin/roles/{$superAdminRole->id}");
    $response->assertSessionHasErrors(['role' => 'Cannot delete Super Admin role.']);
    expect(Role::find($superAdminRole->id))->not->toBeNull();
});
