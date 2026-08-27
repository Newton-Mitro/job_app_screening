<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CandidateApplication extends Model
{
    protected $fillable = [
        'candidate_id',
        'job_circular_id',
        'application_number',
        'status',
        'total_score',
        'recommendation',
        'applied_at',
        'screened_at',
    ];

    protected function casts(): array
    {
        return [
            'total_score' => 'decimal:2',
            'applied_at' => 'datetime',
            'screened_at' => 'datetime',
        ];
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function jobCircular(): BelongsTo
    {
        return $this->belongsTo(JobCircular::class);
    }

    public function emailMessages(): HasMany
    {
        return $this->hasMany(EmailMessage::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(CandidateAnswer::class);
    }

    public function screeningResult(): HasOne
    {
        return $this->hasOne(ScreeningResult::class);
    }

    public function emailAttachments(): HasMany
    {
        return $this->hasMany(EmailAttachment::class);
    }
}