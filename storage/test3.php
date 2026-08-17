<?php
$user = App\Models\User::first();
\Illuminate\Support\Facades\Auth::login($user);
$lead = App\Models\Lead::first();
if ($lead) {
    $request = Illuminate\Http\Request::create('/leads/' . $lead->id, 'GET');
    $request->setUserResolver(function() use ($user) { return $user; });
    try {
        $response = app()->handle($request);
        echo "Status: " . $response->getStatusCode() . "\n";
    } catch (\Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
} else {
    echo "No leads found to test.";
}
