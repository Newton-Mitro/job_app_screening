<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('job_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_circular_id')->constrained('job_circulars')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['required', 'preferred', 'bonus'])->default('required');
            $table->decimal('weight', 5, 2)->default(0);
            $table->decimal('minimum_experience_years', 5, 1)->nullable();
            $table->enum('proficiency', ['beginner', 'intermediate', 'advanced', 'expert'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_skills');
    }
};
