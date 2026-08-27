<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateAnswer extends Model
{
    protected $fillable = [
        'candidate_application_id',
        'screening_question_id',
        'answer',
        'score',
    ];

    protected function casts(): array
    {
        return [
            'candidate_application_id' => 'integer',
            'screening_question_id' => 'integer',
            'score' => 'decimal:2',
        ];
    }

    public function candidateApplication(): BelongsTo
    {
        return $this->belongsTo(CandidateApplication::class);
    }

    public function screeningQuestion(): BelongsTo
    {
        return $this->belongsTo(ScreeningQuestion::class);
    }
}