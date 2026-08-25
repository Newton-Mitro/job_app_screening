<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidate_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('job_circular_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('resume_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('status')
                ->default('received');

            $table->timestamp('applied_at')
                ->nullable();

            $table->timestamps();

            $table->unique([
                'candidate_id',
                'job_circular_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
