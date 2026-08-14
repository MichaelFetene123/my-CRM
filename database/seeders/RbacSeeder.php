<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RbacSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'description' => 'Has all permissions']);
        $standardRole = Role::firstOrCreate(['name' => 'Restricted/Standard User', 'description' => 'Default user role']);

        $manageUsers = Permission::firstOrCreate(['name' => 'manage_users', 'description' => 'Can manage users']);
        $manageRoles = Permission::firstOrCreate(['name' => 'manage_roles', 'description' => 'Can manage roles and permissions']);

        $superAdminRole->permissions()->syncWithoutDetaching([$manageUsers->id, $manageRoles->id]);

        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin@123'),
            ]
        );

        if (!$admin->hasRole('Super Admin')) {
            $admin->roles()->attach($superAdminRole);
        }
    }
}
