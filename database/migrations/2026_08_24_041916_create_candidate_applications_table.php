<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('candidate_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_circular_id')->constrained()->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->string('application_number')->unique();
            $table->enum('status', ['pending', 'processing', 'screened', 'shortlisted', 'rejected', 'hired',])->default('pending');
            $table->decimal('total_score', 5, 2)->nullable();
            $table->enum('recommendation', ['strong_match', 'good_match', 'potential_match', 'not_recommended',])->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();

            $table->unique([
                'candidate_id',
                'job_circular_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_applications');
    }
};
