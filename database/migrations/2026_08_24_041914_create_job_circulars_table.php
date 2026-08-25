<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('job_circulars', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('required_skills')->nullable();
            $table->unsignedInteger('minimum_experience')->default(0);
            $table->string('education_requirement')->nullable();
            $table->enum('status', [
                'draft',
                'open',
                'closed',
            ])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_circulars');
    }
};
