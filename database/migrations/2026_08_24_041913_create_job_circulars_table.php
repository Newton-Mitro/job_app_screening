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
            $table->unsignedInteger('vacancy_count')->nullable();
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->text('benefits')->nullable();
            $table->unsignedInteger('minimum_experience')->default(0);
            $table->decimal('maximum_salary', 15, 2)->nullable();
            $table->string('education_requirement')->nullable();
            $table->enum('status', ['draft', 'open', 'closed',])->default('draft');
            $table->date('deadline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_circulars');
    }
};
