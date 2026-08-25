<?php

namespace App\Services\Resume;

interface ResumeParserInterface
{
    /**
     * Determine whether this parser supports the file.
     */
    public function supports(
        string $extension,
        ?string $mimeType = null
    ): bool;

    /**
     * Extract raw text from the resume.
     */
    public function extract(string $filePath): string;
}