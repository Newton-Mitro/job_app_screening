<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->decimal(
                'required_skills_score',
                5,
                2
            )->default(0);
            $table->decimal(
                'preferred_skills_score',
                5,
                2
            )->default(0);
            $table->decimal(
                'experience_score',
                5,
                2
            )->default(0);
            $table->decimal(
                'education_score',
                5,
                2
            )->default(0);
            $table->decimal(
                'keyword_score',
                5,
                2
            )->default(0);
            $table->decimal(
                'total_score',
                5,
                2
            )->default(0);
            $table->string('decision')
                ->default('pending');
            $table->json('details')
                ->nullable();
            $table->timestamp('screened_at')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screenings');
    }
};
