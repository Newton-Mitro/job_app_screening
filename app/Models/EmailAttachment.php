<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailAttachment extends Model
{
    protected $fillable = [
        'candidate_id',
        'candidate_application_id',
        'attachment_type',
        'original_filename',
        'stored_filename',
        'path',
        'extension',
        'mime_type',
        'file_size',
        'file_type',
        'extracted_text',
        'parse_status',
        'parse_error',
        'parsed_at',
    ];

    protected function casts(): array
    {
        return [
            'candidate_id' => 'integer',
            'candidate_application_id' => 'integer',
            'file_size' => 'integer',
            'parsed_at' => 'datetime',
        ];
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function candidateApplication(): BelongsTo
    {
        return $this->belongsTo(CandidateApplication::class);
    }
}