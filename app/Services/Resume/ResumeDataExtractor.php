<?php

namespace App\Services\Resume;

class ResumeDataExtractor
{
    /**
     * Extract candidate information from resume text.
     */
    public function extract(string $text): array
    {
        return [
            'name' => $this->extractName($text),

            'email' => $this->extractEmail($text),

            'phone' => $this->extractPhone($text),

            'experience_years' =>
                $this->extractExperienceYears($text),

            'skills' =>
                $this->extractSkills($text),

            'education' =>
                $this->extractEducation($text),
        ];
    }

    /**
     * Extract email address.
     */
    private function extractEmail(
        string $text
    ): ?string {
        preg_match(
            '/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i',
            $text,
            $matches
        );

        return $matches[0] ?? null;
    }

    /**
     * Extract phone number.
     */
    private function extractPhone(
        string $text
    ): ?string {
        $patterns = [
            '/\+880[\s\-]?[0-9]{10,11}/',
            '/01[3-9][\s\-]?[0-9]{8,9}/',
            '/\+[0-9]{8,15}/',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return trim($matches[0]);
            }
        }

        return null;
    }

    /**
     * Extract likely candidate name.
     *
     * This is intentionally conservative.
     */
    private function extractName(
        string $text
    ): ?string {
        $lines = preg_split(
            '/\R/',
            $text
        );

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            if (
                str_contains(
                    strtolower($line),
                    '@'
                )
            ) {
                continue;
            }

            if (
                preg_match(
                    '/^[\p{L}][\p{L}\s.\'-]{2,60}$/u',
                    $line
                )
            ) {
                return $line;
            }
        }

        return null;
    }

    /**
     * Extract years of experience.
     */
    private function extractExperienceYears(
        string $text
    ): float {
        $patterns = [
            '/(\d+(?:\.\d+)?)\+?\s*years?\s*(?:of)?\s*experience/i',

            '/experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\+?\s*years?/i',

            '/(\d+(?:\.\d+)?)\+?\s*yrs?/i',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return (float) $matches[1];
            }
        }

        return 0;
    }

    /**
     * Extract common technical skills.
     */
    private function extractSkills(
        string $text
    ): array {
        $knownSkills = [
            'PHP',
            'Laravel',
            'Symfony',
            'JavaScript',
            'TypeScript',
            'React',
            'React.js',
            'Vue',
            'Angular',
            'Node.js',
            'NestJS',
            'Express.js',
            'C#',
            '.NET',
            '.NET Core',
            'Java',
            'Spring Boot',
            'Flutter',
            'Dart',
            'Android',
            'Kotlin',
            'Swift',
            'MySQL',
            'PostgreSQL',
            'SQL Server',
            'MongoDB',
            'Redis',
            'Docker',
            'Kubernetes',
            'Git',
            'REST API',
            'GraphQL',
            'AWS',
            'Azure',
            'GCP',
        ];

        $found = [];

        foreach ($knownSkills as $skill) {
            $pattern = '/(?<![\p{L}\p{N}])'
                . preg_quote($skill, '/')
                . '(?![\p{L}\p{N}])/iu';

            if (
                preg_match(
                    $pattern,
                    $text
                )
            ) {
                $found[] = $skill;
            }
        }

        return array_values(
            array_unique($found)
        );
    }

    /**
     * Extract education information.
     */
    private function extractEducation(
        string $text
    ): ?string {
        $educationKeywords = [
            'PhD',
            'Doctorate',
            'Master',
            'MSc',
            'MBA',
            'Bachelor',
            'BSc',
            'BBA',
            'Diploma',
            'HSC',
            'SSC',
        ];

        foreach ($educationKeywords as $keyword) {
            if (
                preg_match(
                    '/' . preg_quote(
                        $keyword,
                        '/'
                    ) . '/i',
                    $text
                )
            ) {
                return $keyword;
            }
        }

        return null;
    }
}