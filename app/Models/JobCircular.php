<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobCircular extends Model
{
    protected $fillable = [
        'code',
        'title',
        'vacancy_count',
        'description',
        'requirements',
        'benefits',
        'minimum_experience',
        'maximum_salary',
        'education_requirement',
        'status',
        'deadline',
    ];

    protected function casts(): array
    {
        return [
            'vacancy_count' => 'integer',
            'minimum_experience' => 'integer',
            'maximum_salary' => 'decimal:2',
            'deadline' => 'date',
        ];
    }

    public function skills(): HasMany
    {
        return $this->hasMany(JobSkill::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(CandidateApplication::class);
    }

    public function screeningQuestions(): HasMany
    {
        return $this->hasMany(ScreeningQuestion::class);
    }
}