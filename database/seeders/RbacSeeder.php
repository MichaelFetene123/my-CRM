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

        $superAdminPermissions = [
            Permission::firstOrCreate(['name' => 'manage_users', 'description' => 'Can manage users'])->id,
            Permission::firstOrCreate(['name' => 'manage_roles', 'description' => 'Can manage roles and permissions'])->id,
        ];
        $standardPermissions = [];

        $modules = ['contacts', 'leads', 'opportunities', 'activities'];
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

        $superAdminRole->permissions()->syncWithoutDetaching($superAdminPermissions);
        $standardRole->permissions()->syncWithoutDetaching($standardPermissions);

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
