<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Role::class);

        return Inertia::render('admin/roles/index', [
            'roles' => Role::with('permissions')->get(),
            'permissions' => Permission::all(),
        ]);
    }

    public function apiIndex()
    {
        Gate::authorize('viewAny', Role::class);

        return response()->json(Role::where('name', '!=', 'Super Admin')->get());
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Role::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (! empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Role created successfully.', 'role' => $role->load('permissions')]);
        }

        return back()->with('success', 'Role created successfully.');
    }

    public function apiStore(Request $request)
    {
        Gate::authorize('create', Role::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (! empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return response()->json(['message' => 'Role created successfully.', 'role' => $role->load('permissions')]);
    }

    public function assignPermission(Request $request, Role $role)
    {
        Gate::authorize('update', $role);

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

    public function apiAssignPermission(Request $request, Role $role)
    {
        Gate::authorize('update', $role);

        $request->validate([
            'permission_id' => 'required|exists:permissions,id',
        ]);

        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot modify Super Admin permissions directly.'], 422);
        }

        $role->permissions()->syncWithoutDetaching([$request->permission_id]);

        return response()->json(['message' => 'Permission assigned successfully.']);
    }

    public function update(Request $request, Role $role)
    {
        Gate::authorize('update', $role);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($role->name === 'Super Admin') {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Cannot modify Super Admin directly.'], 422);
            }

            return back()->withErrors(['role' => 'Cannot modify Super Admin directly.']);
        }

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        } else {
            $role->permissions()->sync([]);
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Role updated successfully.', 'role' => $role->load('permissions')]);
        }

        return back()->with('success', 'Role updated successfully.');
    }

    public function apiUpdate(Request $request, Role $role)
    {
        Gate::authorize('update', $role);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id,
            'description' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot modify Super Admin directly.'], 422);
        }

        $role->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        } else {
            $role->permissions()->sync([]);
        }

        return response()->json(['message' => 'Role updated successfully.', 'role' => $role->load('permissions')]);
    }

    public function destroy(Request $request, Role $role)
    {
        Gate::authorize('delete', $role);

        if ($role->name === 'Super Admin') {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Cannot delete Super Admin role.'], 422);
            }

            return back()->withErrors(['role' => 'Cannot delete Super Admin role.']);
        }

        $role->delete();

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Role deleted successfully.']);
        }

        return back()->with('success', 'Role deleted successfully.');
    }

    public function apiDestroy(Request $request, Role $role)
    {
        Gate::authorize('delete', $role);

        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot delete Super Admin role.'], 422);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully.']);
    }
}
