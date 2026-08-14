<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/roles/index', [
            'roles' => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:255',
        ]);

        $role = Role::create($validated);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Role created successfully.', 'role' => $role]);
        }

        return back()->with('success', 'Role created successfully.');
    }

    public function assignPermission(Request $request, Role $role)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id',
        ]);

        if ($role->name === 'Super Admin') {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Cannot modify Super Admin permissions directly.'], 422);
            }
            return back()->withErrors(['role' => 'Cannot modify Super Admin permissions directly.']);
        }

        $role->permissions()->syncWithoutDetaching([$request->permission_id]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Permission assigned successfully.']);
        }

        return back()->with('success', 'Permission assigned successfully.');
    }
}
