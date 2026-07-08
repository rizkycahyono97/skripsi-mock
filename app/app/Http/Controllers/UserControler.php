<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserControler extends Controller
{
    public function index()
    {
        Gate::authorize('role', ['arsip']);

        $users = User::with('wallet')->latest()->paginate(10);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        Gate::authorize('role', ['arsip']);

        $user->load('wallet');

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    public function create()
    {
        Gate::authorize('role', ['arsip']);

        return Inertia::render('users/create', [
            'user' => null,
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('role', ['arsip']);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|in:admin,arsip,user',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil dibuat.');
    }

    // public function edit(User $user)
    // {
    //     Gate::authorize('role', ['arsip']);

    //     return Inertia::render('users/edit', [
    //         'user' => [
    //             'id' => $user->id,
    //             'name' => $user->name,
    //             'email' => $user->email,
    //             'role' => $user->role,
    //         ],
    //     ]);
    // }

    public function update(Request $request, User $user)
    {
        // dd($user);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|string|in:admin,arsip,user',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (! empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }
}
