<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resume extends Model
{
    protected $fillable = [
        'candidate_id',
        'original_filename',
        'stored_filename',
        'path',
        'extension',
        'mime_type',
        'file_size',
        'extracted_text',
        'parse_status',
        'parse_error',
        'parsed_at',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'parsed_at' => 'datetime',
        ];
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}