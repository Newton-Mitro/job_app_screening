<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'address',
        'education',
        'current_position',
        'current_company',
        'total_experience_years',
        'skills',
        'current_salary',
        'expected_salary',
        'notice_period',
        'linkedin_url',
        'github_url',
        'portfolio_url',
    ];

    protected function casts(): array
    {
        return [
            'education' => 'array',
            'skills' => 'array',
            'total_experience_years' => 'decimal:1',
            'current_salary' => 'decimal:2',
            'expected_salary' => 'decimal:2',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(CandidateApplication::class);
    }

    public function skillsRelation(): HasMany
    {
        return $this->hasMany(CandidateSkill::class);
    }

    public function emailAttachments(): HasMany
    {
        return $this->hasMany(EmailAttachment::class);
    }
}