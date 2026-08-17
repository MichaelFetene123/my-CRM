<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\PipelineStageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/notes', fn () => Inertia::render('notes-index'))->name('notes.index');

    Route::resource('contacts', ContactController::class)->except(['create', 'edit']);
    Route::prefix('api')->name('apiContacts.')->group(function () {
        Route::get('contacts', [ContactController::class, 'apiIndex'])->name('index');
        Route::post('contacts', [ContactController::class, 'apiStore'])->name('store');
        Route::get('contacts/{contact}', [ContactController::class, 'apiShow'])->name('show');
        Route::put('contacts/{contact}', [ContactController::class, 'apiUpdate'])->name('update');
        Route::delete('contacts/{contact}', [ContactController::class, 'apiDestroy'])->name('destroy');
    });

    Route::prefix('api')->name('apiLeads.')->group(function () {
        Route::get('leads', [LeadController::class, 'apiIndex'])->name('index');
        Route::post('leads', [LeadController::class, 'apiStore'])->name('store');
        Route::post('leads/{lead}/convert', [LeadController::class, 'apiConvert'])->name('convert');
        Route::post('leads/{lead}/discard', [LeadController::class, 'apiDiscard'])->name('discard');
        Route::delete('leads/{lead}', [LeadController::class, 'apiDestroy'])->name('destroy');
    });

    Route::prefix('api')->name('apiOpportunities.')->group(function () {
        Route::get('opportunities', [OpportunityController::class, 'apiIndex'])->name('index');
        Route::post('opportunities', [OpportunityController::class, 'apiStore'])->name('store');
        Route::get('opportunities/{opportunity}', [OpportunityController::class, 'apiShow'])->name('show');
        Route::post('opportunities/{opportunity}/move', [OpportunityController::class, 'apiMove'])->name('move');
        Route::post('opportunities/{opportunity}/won', [OpportunityController::class, 'apiMarkWon'])->name('won');
        Route::post('opportunities/{opportunity}/lost', [OpportunityController::class, 'apiMarkLost'])->name('lost');
        Route::post('opportunities/{opportunity}/reopen', [OpportunityController::class, 'apiReopen'])->name('reopen');
        Route::delete('opportunities/{opportunity}', [OpportunityController::class, 'apiDestroy'])->name('destroy');
    });

    Route::prefix('api')->name('apiPipelineStages.')->group(function () {
        Route::get('pipeline-stages', [PipelineStageController::class, 'apiIndex'])->name('index');
        Route::post('pipeline-stages', [PipelineStageController::class, 'apiStore'])->name('store');
        Route::put('pipeline-stages/{pipeline_stage}', [PipelineStageController::class, 'apiUpdate'])->name('update');
        Route::delete('pipeline-stages/{pipeline_stage}', [PipelineStageController::class, 'apiDestroy'])->name('destroy');
    });

    Route::prefix('api')->name('apiActivities.')->group(function () {
        Route::get('activities', [ActivityController::class, 'apiIndex'])->name('index');
        Route::post('activities', [ActivityController::class, 'apiStore'])->name('store');
        Route::post('activities/{activity}/complete', [ActivityController::class, 'apiComplete'])->name('complete');
        Route::delete('activities/{activity}', [ActivityController::class, 'apiDestroy'])->name('destroy');
    });

    Route::prefix('api')->name('apiNotes.')->group(function () {
        Route::get('notes', [NoteController::class, 'apiIndex'])->name('index');
        Route::post('notes', [NoteController::class, 'apiStore'])->name('store');
        Route::put('notes/{note}', [NoteController::class, 'apiUpdate'])->name('update');
        Route::delete('notes/{note}', [NoteController::class, 'apiDestroy'])->name('destroy');
    });
    Route::resource('leads', LeadController::class)->except(['create', 'edit']);
    Route::post('leads/{lead}/convert', [LeadController::class, 'convert'])->name('leads.convert');
    Route::post('leads/{lead}/discard', [LeadController::class, 'discard'])->name('leads.discard');

    Route::get('opportunities/stages', [OpportunityController::class, 'stages'])->name('opportunities.stages');
    Route::resource('opportunities', OpportunityController::class)->except(['create', 'edit']);
    Route::post('opportunities/{opportunity}/move', [OpportunityController::class, 'move'])->name('opportunities.move');
    Route::post('opportunities/{opportunity}/won', [OpportunityController::class, 'markWon'])->name('opportunities.won');
    Route::post('opportunities/{opportunity}/lost', [OpportunityController::class, 'markLost'])->name('opportunities.lost');
    Route::post('opportunities/{opportunity}/reopen', [OpportunityController::class, 'reopen'])->name('opportunities.reopen');

    Route::resource('activities', ActivityController::class)->except(['create', 'edit', 'show']);
    Route::post('activities/{activity}/complete', [ActivityController::class, 'complete'])->name('activities.complete');

    Route::post('notes', [NoteController::class, 'store'])->name('notes.store');

    Route::get('notifications/unread-count', fn (Request $request) => response()->json([
        'count' => $request->user()->unreadNotifications()->count(),
    ]))->name('notifications.unread-count');

    Route::prefix('api')->name('apiRoles.')->middleware('can:manage_roles')->group(function () {
        Route::get('roles', [RoleController::class, 'apiIndex'])->name('index');
        Route::post('roles', [RoleController::class, 'apiStore'])->name('store');
        Route::post('roles/{role}/permissions', [RoleController::class, 'apiAssignPermission'])->name('assign-permission');
        Route::put('roles/{role}', [RoleController::class, 'apiUpdate'])->name('update');
        Route::delete('roles/{role}', [RoleController::class, 'apiDestroy'])->name('destroy');
    });

    Route::prefix('api/admin')->name('adminApiUsers.')->middleware('can:manage_users')->group(function () {
        Route::post('users', [UserController::class, 'apiStore'])->name('store');
        Route::put('users/{user}', [UserController::class, 'apiUpdate'])->name('update');
        Route::delete('users/{user}', [UserController::class, 'apiDestroy'])->name('destroy');
        Route::post('users/{user}/roles', [UserController::class, 'apiAssignRole'])->name('assign-role');
        Route::post('users/{user}/reset-password', [UserController::class, 'apiResetPassword'])->name('reset-password');
    });

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::middleware('can:manage_users')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::post('users', [UserController::class, 'store'])->name('users.store');
            Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
            Route::post('users/{user}/roles', [UserController::class, 'assignRole'])->name('users.assign-role');
            Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
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
