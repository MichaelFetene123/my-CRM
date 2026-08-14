<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/users/index', [
            'users' => User::with('roles')->get(),
            'roles' => Role::all(),
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($request->role_id);

        if ($role->name === 'Super Admin' && !$request->user()->hasRole('Super Admin')) {
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
}
