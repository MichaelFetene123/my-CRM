<?php

namespace App\Http\Controllers;

use App\Actions\Activities\CompleteActivity;
use App\Http\Requests\StoreActivityRequest;
use App\Models\Activity;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Activities/Index', [
            'activities' => Activity::with('entity')->orderBy('due_at')->get(),
        ]);
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
}