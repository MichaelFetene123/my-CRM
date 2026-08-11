<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\OpportunityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('contacts', ContactController::class)->except(['create', 'edit']);
    Route::resource('leads', LeadController::class)->except(['create', 'edit']);
    Route::post('leads/{lead}/convert', [LeadController::class, 'convert'])->name('leads.convert');
    Route::post('leads/{lead}/discard', [LeadController::class, 'discard'])->name('leads.discard');

    Route::resource('opportunities', OpportunityController::class)->except(['create', 'edit']);
    Route::post('opportunities/{opportunity}/move', [OpportunityController::class, 'move'])->name('opportunities.move');
    Route::post('opportunities/{opportunity}/won', [OpportunityController::class, 'markWon'])->name('opportunities.won');
    Route::post('opportunities/{opportunity}/lost', [OpportunityController::class, 'markLost'])->name('opportunities.lost');

    Route::resource('activities', ActivityController::class)->except(['create', 'edit', 'show']);
    Route::post('activities/{activity}/complete', [ActivityController::class, 'complete'])->name('activities.complete');

    Route::post('notes', [NoteController::class, 'store'])->name('notes.store');

    Route::get('notifications/unread-count', fn () => response()->json([
        'count' => auth()->user()->unreadNotifications()->count(),
    ]))->name('notifications.unread-count');
});

require __DIR__.'/settings.php';