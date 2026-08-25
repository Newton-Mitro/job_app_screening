<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobCircular extends Model
{
    protected $fillable = [
        'code',
        'title',
        'description',
        'required_skills',
        'minimum_experience',
        'education_requirement',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'required_skills' => 'array',
            'minimum_experience' => 'integer',
        ];
    }

    public function skills(): HasMany
    {
        return $this->hasMany(JobSkill::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}