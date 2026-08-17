<?php

namespace Database\Seeders;

use App\Models\PipelineStage;
use Illuminate\Database\Seeder;

class PipelineStageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */ // database/seeders/PipelineStageSeeder.php
    public function run(): void
    {
        $stages = [
            ['name' => 'New', 'order' => 1, 'is_won' => false, 'is_lost' => false],
            ['name' => 'Contacted', 'order' => 2, 'is_won' => false, 'is_lost' => false],
            ['name' => 'Proposal Sent', 'order' => 3, 'is_won' => false, 'is_lost' => false],
            ['name' => 'Negotiation', 'order' => 4, 'is_won' => false, 'is_lost' => false],
            ['name' => 'Won', 'order' => 5, 'is_won' => true, 'is_lost' => false],
            ['name' => 'Lost', 'order' => 6, 'is_won' => false, 'is_lost' => true],
        ];

        foreach ($stages as $stage) {
            PipelineStage::create($stage);
        }
    }
}
