<?php
$user = App\Models\User::first();
\Illuminate\Support\Facades\Auth::login($user);
$request = Illuminate\Http\Request::create('/api/search', 'GET', ['q' => 'test']);
$request->setUserResolver(function() use ($user) { return $user; });
try {
    $response = app()->handle($request);
    echo $response->getContent();
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
