<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\UserControler;
use App\Http\Controllers\VerifyController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// public
Route::get('/verify/qr/{documentKey}', [VerifyController::class, 'verifyQr'])->name('documents.verify-qr');

// private
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Documents
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('/documents/upload', [DocumentController::class, 'upload'])->name('documents.upload');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document:document_uuid}', [DocumentController::class,  'show'])->name('documents.show');
    Route::post('/documents/{document:document_uuid}/sign-blockchain', [DocumentController::class, 'sendToBlockchain'])->name('documents.sign-blockchain');

    // users
    Route::get('/users', [UserControler::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [UserControler::class, 'show'])->name('users.show');

    // wallet
    Route::post('/users/{user}/wallet', [WalletController::class, 'generateWallet'])->name('wallet.generate');

});

require __DIR__.'/settings.php';
