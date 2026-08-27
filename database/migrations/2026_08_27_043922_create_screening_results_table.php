<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('screening_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_application_id')->constrained()->cascadeOnDelete();
            $table->decimal('skills_score', 5, 2)->default(0);
            $table->decimal('experience_score', 5, 2)->default(0);
            $table->decimal('education_score', 5, 2)->default(0);
            $table->decimal('salary_score', 5, 2)->default(0);
            $table->decimal('screening_questions_score', 5, 2)->default(0);
            $table->decimal('overall_score', 5, 2)->default(0);
            $table->enum('recommendation', ['strong_match', 'good_match', 'potential_match', 'not_recommended',])->default('not_recommended');
            $table->json('matched_skills')->nullable();
            $table->json('missing_skills')->nullable();
            $table->json('strengths')->nullable();
            $table->json('weaknesses')->nullable();
            $table->text('summary')->nullable();
            $table->timestamp('screened_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('screening_results');
    }
};
