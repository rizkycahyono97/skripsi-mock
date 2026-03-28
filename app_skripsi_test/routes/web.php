<?php

use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('dashboard', 'dashboard')->name('dashboard');
    
    // document
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::post('/documents/{id}/setujui', [DocumentController::class, 'setujui'])
    ->name('documents.setujui');
    Route::get('/documents/{id}', [DocumentController::class, 'show'])->name('documents.show');
    // Route::match(['get', 'post'], '/documents/{id}/setujui',  [DocumentController::class, 'setujui'])->name('documents.setujui');
});

require __DIR__.'/settings.php';
