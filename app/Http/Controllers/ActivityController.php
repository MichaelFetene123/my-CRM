<?php

namespace App\Http\Controllers;

use App\Actions\Activities\CompleteActivity;
use App\Http\Requests\StoreActivityRequest;
use App\Models\Activity;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(\Illuminate\Http\Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $user->unreadNotifications()->update(['read_at' => now()]);

        return Inertia::render('Activities/Index', [
            'activities' => Inertia::defer(fn () => Activity::with('entity')->orderBy('due_at')->get()),
        ]);
    }

    public function apiIndex(\Illuminate\Http\Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        $user->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(Activity::with('entity')->orderBy('due_at')->get());
    }

    public function store(StoreActivityRequest $request)
    {
        Activity::create([...$request->validated(), 'owner_id' => $request->user()->id]);

        return redirect()->back();
    }

    public function update(StoreActivityRequest $request, Activity $activity)
    {
        $activity->update($request->validated());

        return redirect()->back();
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();

        return redirect()->back();
    }

    public function complete(Activity $activity, CompleteActivity $action)
    {
        $action($activity);

        return redirect()->back();
    }

    public function apiComplete(Activity $activity, CompleteActivity $action)
    {
        $action($activity);

        return response()->json(['success' => true]);
    }
}
