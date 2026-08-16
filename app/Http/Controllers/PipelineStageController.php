<?php

namespace App\Http\Controllers;

use App\Models\PipelineStage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PipelineStageController extends Controller
{
    public function apiIndex(): JsonResponse
    {
        $stages = PipelineStage::withCount('opportunities')
            ->orderBy('order')
            ->get();
            
        return response()->json($stages);
    }

    public function apiStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer',
            'is_won' => 'boolean',
            'is_lost' => 'boolean',
        ]);

        $stage = PipelineStage::create([
            'name' => $validated['name'],
            'order' => $validated['order'],
            'is_won' => $validated['is_won'] ?? false,
            'is_lost' => $validated['is_lost'] ?? false,
        ]);

        return response()->json(['stage' => $stage], 201);
    }

    public function apiUpdate(Request $request, PipelineStage $pipeline_stage): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer',
            'is_won' => 'boolean',
            'is_lost' => 'boolean',
        ]);

        $pipeline_stage->update([
            'name' => $validated['name'],
            'order' => $validated['order'],
            'is_won' => $validated['is_won'] ?? false,
            'is_lost' => $validated['is_lost'] ?? false,
        ]);

        return response()->json(['stage' => $pipeline_stage]);
    }

    public function apiDestroy(PipelineStage $pipeline_stage): JsonResponse
    {
        if ($pipeline_stage->opportunities()->exists()) {
            return response()->json([
                'message' => 'Cannot delete stage because it contains opportunities. Please move them to another stage first.'
            ], 422);
        }

        $pipeline_stage->delete();

        return response()->json(null, 204);
    }
}
