<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\OpportunityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('contacts', ContactController::class)->except(['create', 'edit']);
    Route::prefix('api')->name('apiContacts.')->group(function () {
        Route::get('contacts', [ContactController::class, 'apiIndex'])->name('index');
        Route::get('contacts/{contact}', [ContactController::class, 'apiShow'])->name('show');
    });

    Route::prefix('api')->name('apiLeads.')->group(function () {
        Route::get('leads', [LeadController::class, 'apiIndex'])->name('index');
        Route::post('leads/{lead}/convert', [LeadController::class, 'apiConvert'])->name('convert');
        Route::post('leads/{lead}/discard', [LeadController::class, 'apiDiscard'])->name('discard');
    });

    Route::prefix('api')->name('apiOpportunities.')->group(function () {
        Route::get('opportunities', [OpportunityController::class, 'apiIndex'])->name('index');
        Route::get('opportunities/{opportunity}', [OpportunityController::class, 'apiShow'])->name('show');
        Route::post('opportunities/{opportunity}/move', [OpportunityController::class, 'apiMove'])->name('move');
        Route::post('opportunities/{opportunity}/won', [OpportunityController::class, 'apiMarkWon'])->name('won');
        Route::post('opportunities/{opportunity}/lost', [OpportunityController::class, 'apiMarkLost'])->name('lost');
    });

    Route::prefix('api')->name('apiActivities.')->group(function () {
        Route::get('activities', [ActivityController::class, 'apiIndex'])->name('index');
        Route::post('activities/{activity}/complete', [ActivityController::class, 'apiComplete'])->name('complete');
    });
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

    Route::get('notifications/unread-count', fn (Request $request) => response()->json([
        'count' => $request->user()->unreadNotifications()->count(),
    ]))->name('notifications.unread-count');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::middleware('can:manage_users')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::post('users/{user}/roles', [UserController::class, 'assignRole'])->name('users.assign-role');
        });

        Route::middleware('can:manage_roles')->group(function () {
            Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
            Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
            Route::post('roles/{role}/permissions', [RoleController::class, 'assignPermission'])->name('roles.assign-permission');
            Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
        });
    });
});

require __DIR__.'/settings.php';
