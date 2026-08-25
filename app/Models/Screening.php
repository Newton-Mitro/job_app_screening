<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Screening extends Model
{
    protected $fillable = [
        'application_id',
        'required_skills_score',
        'preferred_skills_score',
        'experience_score',
        'education_score',
        'keyword_score',
        'total_score',
        'decision',
        'details',
        'screened_at',
    ];

    protected function casts(): array
    {
        return [
            'required_skills_score' => 'decimal:2',
            'preferred_skills_score' => 'decimal:2',
            'experience_score' => 'decimal:2',
            'education_score' => 'decimal:2',
            'keyword_score' => 'decimal:2',
            'total_score' => 'decimal:2',
            'details' => 'array',
            'screened_at' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}