<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::whereDoesntHave('roles', function ($query) {
                $query->where('name', 'Super Admin');
            })->with('roles')->get(),
            'roles' => Role::all(),
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($request->role_id);

        if ($role->name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot assign the Super Admin role.',
            ]);
        }

        if ($user->id === $request->user()->id && $role->name !== 'Super Admin' && $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot demote yourself.',
            ]);
        }

        $user->roles()->syncWithoutDetaching([$role->id]);

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Role assigned successfully.']);
        }

        return back()->with('success', 'Role assigned successfully.');
    }

    public function apiAssignRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($request->role_id);

        if ($role->name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot assign the Super Admin role.',
            ]);
        }

        if ($user->id === $request->user()->id && $role->name !== 'Super Admin' && $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot demote yourself.',
            ]);
        }

        $user->roles()->syncWithoutDetaching([$role->id]);

        return response()->json(['message' => 'Role assigned successfully.']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);

        if ($role->name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot assign the Super Admin role.',
            ]);
        }

        $password = Str::random(12);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($password),
        ]);

        $user->roles()->sync([$validated['role_id']]);

        return response()->json([
            'message' => 'User created successfully.',
            'password' => $password,
            'user' => $user->load('roles'),
        ]);
    }

    public function apiStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);

        if ($role->name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot assign the Super Admin role.',
            ]);
        }

        $password = Str::random(12);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($password),
        ]);

        $user->roles()->sync([$validated['role_id']]);

        return response()->json([
            'message' => 'User created successfully.',
            'password' => $password,
            'user' => $user->load('roles'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);

        if ($role->name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot assign the Super Admin role.',
            ]);
        }

        if ($user->id === $request->user()->id && $role->name !== 'Super Admin' && $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot demote yourself.',
            ]);
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $user->roles()->sync([$validated['role_id']]);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user->load('roles'),
        ]);
    }

    public function apiUpdate(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);

        if ($role->name === 'Super Admin' && ! $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot assign the Super Admin role.',
            ]);
        }

        if ($user->id === $request->user()->id && $role->name !== 'Super Admin' && $request->user()->hasRole('Super Admin')) {
            throw ValidationException::withMessages([
                'role_id' => 'You cannot demote yourself.',
            ]);
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $user->roles()->sync([$validated['role_id']]);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user->load('roles'),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete yourself.'], 403);
        }

        if ($user->hasRole('Super Admin') && ! $request->user()->hasRole('Super Admin')) {
            return response()->json(['message' => 'You cannot delete a Super Admin.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function apiDestroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete yourself.'], 403);
        }

        if ($user->hasRole('Super Admin') && ! $request->user()->hasRole('Super Admin')) {
            return response()->json(['message' => 'You cannot delete a Super Admin.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function apiDestroyAll(Request $request)
    {
        if (! $request->user()->hasRole('Super Admin')) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->delete();

        return response()->json(['message' => 'Users deleted successfully.']);
    }

    public function resetPassword(Request $request, User $user)
    {
        if ($user->hasRole('Super Admin') && ! $request->user()->hasRole('Super Admin')) {
            return response()->json(['message' => 'You cannot reset password for a Super Admin.'], 403);
        }

        $password = Str::random(12);

        $user->update([
            'password' => Hash::make($password),
        ]);

        return response()->json([
            'message' => 'Password reset successfully.',
            'password' => $password,
        ]);
    }

    public function apiResetPassword(Request $request, User $user)
    {
        if ($user->hasRole('Super Admin') && ! $request->user()->hasRole('Super Admin')) {
            return response()->json(['message' => 'You cannot reset password for a Super Admin.'], 403);
        }

        $password = Str::random(12);

        $user->update([
            'password' => Hash::make($password),
        ]);

        return response()->json([
            'message' => 'Password reset successfully.',
            'password' => $password,
        ]);
    }
}
