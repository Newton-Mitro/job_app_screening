<?php

namespace App\Services\Email;

class EmailApplicationParser
{
    /**
     * Parse job information from email subject.
     *
     * Example:
     *
     * ID: 001, Post: Software Engineer
     */
    public function parseSubject(
        string $subject
    ): ?array {
        $pattern = '/^ID:\s*([A-Za-z0-9\-_]+)\s*,\s*Post:\s*(.+)$/i';

        if (
            !preg_match(
                $pattern,
                trim($subject),
                $matches
            )
        ) {
            return null;
        }

        return [
            'job_code' => trim($matches[1]),
            'job_title' => trim($matches[2]),
        ];
    }

    /**
     * Determine whether an email is
     * a job application.
     */
    public function isApplicationEmail(
        string $subject
    ): bool {
        return $this->parseSubject(
            $subject
        ) !== null;
    }
}