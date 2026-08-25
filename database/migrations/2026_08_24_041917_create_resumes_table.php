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
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('original_filename');
            $table->string('stored_filename');
            $table->string('path');
            $table->string('extension');
            $table->string('mime_type')
                ->nullable();
            $table->unsignedBigInteger('file_size')
                ->default(0);
            $table->longText('extracted_text')
                ->nullable();
            $table->string('parse_status')
                ->default('pending');
            $table->text('parse_error')
                ->nullable();
            $table->timestamp('parsed_at')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};
