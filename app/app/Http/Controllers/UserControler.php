<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserControler extends Controller
{
    public function index()
    {
        $users = User::with('wallet')->latest()->paginate(10);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        $user->load('wallet');

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }
}
