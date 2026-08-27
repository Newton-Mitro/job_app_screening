<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScreeningResult extends Model
{
    protected $fillable = [
        'candidate_application_id',
        'skills_score',
        'experience_score',
        'education_score',
        'salary_score',
        'screening_questions_score',
        'overall_score',
        'recommendation',
        'matched_skills',
        'missing_skills',
        'strengths',
        'weaknesses',
        'summary',
        'screened_at',
    ];

    protected function casts(): array
    {
        return [
            'skills_score' => 'decimal:2',
            'experience_score' => 'decimal:2',
            'education_score' => 'decimal:2',
            'salary_score' => 'decimal:2',
            'screening_questions_score' => 'decimal:2',
            'overall_score' => 'decimal:2',

            'matched_skills' => 'array',
            'missing_skills' => 'array',
            'strengths' => 'array',
            'weaknesses' => 'array',

            'screened_at' => 'datetime',
        ];
    }

    public function candidateApplication(): BelongsTo
    {
        return $this->belongsTo(CandidateApplication::class);
    }
}