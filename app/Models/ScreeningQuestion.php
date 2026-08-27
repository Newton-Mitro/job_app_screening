<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScreeningQuestion extends Model
{
    protected $fillable = [
        'job_circular_id',
        'question',
        'type',
        'options',
        'is_required',
        'sort_order',
        'weight',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_required' => 'boolean',
            'sort_order' => 'integer',
            'weight' => 'decimal:2',
        ];
    }

    public function jobCircular(): BelongsTo
    {
        return $this->belongsTo(JobCircular::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(CandidateAnswer::class);
    }
}