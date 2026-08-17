<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('roles') : null,
                'permissions' => $request->user() ? [
                    'manage_users' => $request->user()->can('manage_users'),
                    'manage_roles' => $request->user()->can('manage_roles'),
                    'contacts_view' => $request->user()->hasPermission('contacts.view'),
                    'leads_view' => $request->user()->hasPermission('leads.view'),
                    'opportunities_view' => $request->user()->hasPermission('opportunities.view'),
                    'activities_view' => $request->user()->hasPermission('activities.view'),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
