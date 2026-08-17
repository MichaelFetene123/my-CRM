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

        $superAdminPermissions = [];
        $standardPermissions = [];

        $modules = ['contacts', 'leads', 'opportunities', 'activities', 'notes', 'users', 'roles'];
        $actions = ['view' => 'Can view %s', 'create' => 'Can create %s', 'update' => 'Can update %s', 'delete' => 'Can delete %s'];

        foreach ($modules as $module) {
            foreach ($actions as $action => $desc) {
                $permission = Permission::firstOrCreate([
                    'name' => "{$module}.{$action}",
                    'description' => sprintf($desc, str_replace('_', ' ', $module)),
                ]);

                $superAdminPermissions[] = $permission->id;

                if ($action === 'view') {
                    $standardPermissions[] = $permission->id;
                }
            }
        }

        $superAdminRole->permissions()->sync($superAdminPermissions);
        $standardRole->permissions()->sync($standardPermissions);

        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin@123'),
            ]
        );

        if (! $admin->hasRole('Super Admin')) {
            $admin->roles()->attach($superAdminRole);
        }
    }
}
