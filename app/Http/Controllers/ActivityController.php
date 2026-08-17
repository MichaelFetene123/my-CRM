<?php

namespace App\Http\Controllers;

use App\Actions\Activities\CompleteActivity;
use App\Actions\Activities\UncompleteActivity;
use App\Http\Requests\StoreActivityRequest;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Activity::class);

        /** @var User $user */
        $user = $request->user();
        $user->unreadNotifications()->update(['read_at' => now()]);

        return Inertia::render('Activities/Index', [
            'activities' => Inertia::defer(fn () => Activity::with('entity')->orderBy('due_at')->get()),
        ]);
    }

    public function apiIndex(Request $request)
    {
        Gate::authorize('viewAny', Activity::class);

        /** @var User $user */
        $user = $request->user();
        $user->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(Activity::with('entity')->orderBy('due_at')->get());
    }

    public function store(StoreActivityRequest $request)
    {
        Gate::authorize('create', Activity::class);

        Activity::create([...$request->validated(), 'owner_id' => $request->user()->id]);

        return redirect()->back();
    }

    public function apiStore(StoreActivityRequest $request)
    {
        Gate::authorize('create', Activity::class);

        $activity = Activity::create([...$request->validated(), 'owner_id' => $request->user()->id]);

        return response()->json($activity);
    }

    public function update(StoreActivityRequest $request, Activity $activity)
    {
        Gate::authorize('update', $activity);

        $activity->update($request->validated());

        return redirect()->back();
    }

    public function apiUpdate(StoreActivityRequest $request, Activity $activity)
    {
        Gate::authorize('update', $activity);

        $activity->update($request->validated());

        return response()->json($activity);
    }

    public function destroy(Activity $activity)
    {
        Gate::authorize('delete', $activity);

        $activity->delete();

        return redirect()->back();
    }

    public function complete(Activity $activity, CompleteActivity $action)
    {
        Gate::authorize('update', $activity);

        $action($activity);

        return redirect()->back();
    }

    public function apiComplete(Activity $activity, CompleteActivity $action)
    {
        Gate::authorize('update', $activity);

        $action($activity);

        return response()->json(['success' => true]);
    }

    public function apiDestroy(Activity $activity)
    {
        Gate::authorize('delete', $activity);

        $activity->delete();

        return response()->noContent();
    }

    public function uncomplete(Activity $activity, UncompleteActivity $action)
    {
        Gate::authorize('update', $activity);

        $action($activity);

        return redirect()->back();
    }

    public function apiUncomplete(Activity $activity, UncompleteActivity $action)
    {
        Gate::authorize('update', $activity);

        $action($activity);

        return response()->json(['success' => true]);
    }
}
