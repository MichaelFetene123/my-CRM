<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
     Schema::create('opportunities', function (Blueprint $table) {
    $table->id();
    $table->foreignId('contact_id')->constrained('contacts')->cascadeOnDelete();
    $table->foreignId('lead_id')->nullable()->constrained('leads')->nullOnDelete();
    $table->string('title');
    $table->foreignId('stage_id')->constrained('pipeline_stages')->restrictOnDelete();
    $table->enum('status', ['open', 'won', 'lost'])->default('open');
    $table->text('lost_reason')->nullable();
    $table->timestamp('stage_entered_at')->nullable();
    $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
