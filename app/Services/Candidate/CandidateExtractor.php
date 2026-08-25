<?php

namespace App\Services\Resume;

class CandidateExtractor
{
    /**
     * Extract candidate information from resume text.
     */
    public function extract(string $text): array
    {
        $text = $this->cleanText($text);

        return [
            'name' => $this->extractName($text),

            'email' => $this->extractEmail($text),

            'phone' => $this->extractPhone($text),

            'experience_years' =>
                $this->extractExperienceYears($text),

            'current_position' =>
                $this->extractCurrentPosition($text),

            'current_company' =>
                $this->extractCurrentCompany($text),

            'education' =>
                $this->extractEducation($text),

            'skills' =>
                $this->extractSkills($text),

            'notice_period' =>
                $this->extractNoticePeriod($text),

            'current_salary' =>
                $this->extractCurrentSalary($text),

            'expected_salary' =>
                $this->extractExpectedSalary($text),

            'raw_text' => $text,
        ];
    }

    /**
     * Clean extracted resume text.
     */
    private function cleanText(string $text): string
    {
        $text = str_replace(
            [
                "\r\n",
                "\r",
                "\t",
            ],
            [
                "\n",
                "\n",
                ' ',
            ],
            $text
        );

        /*
         * Normalize multiple spaces.
         */
        $text = preg_replace(
            '/[ ]{2,}/',
            ' ',
            $text
        );

        /*
         * Normalize excessive empty lines.
         */
        $text = preg_replace(
            "/\n{3,}/",
            "\n\n",
            $text
        );

        return trim($text);
    }

    /**
     * Extract candidate email.
     */
    private function extractEmail(
        string $text
    ): ?string {
        preg_match(
            '/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i',
            $text,
            $matches
        );

        if (empty($matches[0])) {
            return null;
        }

        return strtolower(
            trim($matches[0])
        );
    }

    /**
     * Extract candidate phone number.
     */
    private function extractPhone(
        string $text
    ): ?string {
        $patterns = [
            /*
             * Bangladesh / international.
             */
            '/(?:\+?88)?01[3-9]\d{8}/',

            /*
             * General international format.
             */
            '/\+\d{1,3}[\s\-()]?\d{6,14}/',

            /*
             * General phone format.
             */
            '/\b\d{3,4}[\s\-]\d{3,4}[\s\-]\d{3,5}\b/',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return $this->normalizePhone(
                    $matches[0]
                );
            }
        }

        return null;
    }

    /**
     * Normalize phone number.
     */
    private function normalizePhone(
        string $phone
    ): string {
        return preg_replace(
            '/[^\d+]/',
            '',
            trim($phone)
        );
    }

    /**
     * Extract candidate name.
     *
     * Usually the first meaningful line of
     * a resume is the candidate name.
     */
    private function extractName(
        string $text
    ): ?string {
        $lines = preg_split(
            '/\n+/',
            $text
        );

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            /*
             * Skip obvious resume headings.
             */
            if (
                $this->isHeading($line)
            ) {
                continue;
            }

            /*
             * Skip lines containing email.
             */
            if (
                filter_var(
                    $line,
                    FILTER_VALIDATE_EMAIL
                )
            ) {
                continue;
            }

            /*
             * Skip phone-only lines.
             */
            if (
                preg_match(
                    '/^[\d\s+().\-]+$/',
                    $line
                )
            ) {
                continue;
            }

            /*
             * Name should normally be relatively short.
             */
            $words = preg_split(
                '/\s+/',
                $line
            );

            if (
                count($words) >= 2
                && count($words) <= 5
                && mb_strlen($line) <= 100
            ) {
                return $this->normalizeName(
                    $line
                );
            }
        }

        return null;
    }

    /**
     * Normalize name.
     */
    private function normalizeName(
        string $name
    ): string {
        $name = preg_replace(
            '/\s+/',
            ' ',
            trim($name)
        );

        return mb_convert_case(
            $name,
            MB_CASE_TITLE
        );
    }

    /**
     * Extract total experience.
     */
    private function extractExperienceYears(
        string $text
    ): float {
        $patterns = [
            /*
             * "5 years experience"
             */
            '/(\d+(?:\.\d+)?)\+?\s*years?\s*(?:of\s*)?(?:professional\s*)?experience/i',

            /*
             * "Experience: 5 years"
             */
            '/experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\+?\s*years?/i',

            /*
             * "5+ yrs"
             */
            '/(\d+(?:\.\d+)?)\+?\s*yrs?\b/i',
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

        /*
         * If explicit experience isn't found,
         * try calculating it from employment dates.
         */
        return $this->calculateExperienceFromDates(
            $text
        );
    }

    /**
     * Calculate experience from year ranges.
     */
    private function calculateExperienceFromDates(
        string $text
    ): float {
        preg_match_all(
            '/\b(19\d{2}|20\d{2})\s*(?:\-|–|—|to)\s*(19\d{2}|20\d{2}|present|current)\b/i',
            $text,
            $matches,
            PREG_SET_ORDER
        );

        if (empty($matches)) {
            return 0;
        }

        $totalMonths = 0;

        foreach ($matches as $match) {
            $startYear = (int) $match[1];

            if (
                in_array(
                    strtolower($match[2]),
                    ['present', 'current'],
                    true
                )
            ) {
                $endYear = (int) date('Y');
            } else {
                $endYear = (int) $match[2];
            }

            if ($endYear < $startYear) {
                continue;
            }

            $totalMonths +=
                ($endYear - $startYear) * 12;
        }

        return round(
            $totalMonths / 12,
            1
        );
    }

    /**
     * Extract current position.
     */
    private function extractCurrentPosition(
        string $text
    ): ?string {
        $patterns = [
            '/(?:current\s+)?(?:job\s+)?title\s*[:\-]\s*(.+)/i',

            '/(?:current\s+)?position\s*[:\-]\s*(.+)/i',

            '/designation\s*[:\-]\s*(.+)/i',

            '/role\s*[:\-]\s*(.+)/i',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return $this->cleanSingleLine(
                    $matches[1]
                );
            }
        }

        /*
         * Common technical job titles.
         */
        $titles = [
            'software engineer',
            'senior software engineer',
            'junior software engineer',
            'lead software engineer',
            'principal software engineer',
            'software developer',
            'senior software developer',
            'full stack developer',
            'frontend developer',
            'backend developer',
            'web developer',
            'mobile developer',
            'flutter developer',
            'php developer',
            'laravel developer',
            'react developer',
            'node.js developer',
            'devops engineer',
            'qa engineer',
            'test engineer',
            'technical lead',
            'team lead',
            'engineering manager',
            'project manager',
        ];

        foreach ($titles as $title) {
            if (
                preg_match(
                    '/\b' . preg_quote(
                        $title,
                        '/'
                    ) . '\b/i',
                    $text
                )
            ) {
                return $title;
            }
        }

        return null;
    }

    /**
     * Extract current company.
     */
    private function extractCurrentCompany(
        string $text
    ): ?string {
        $patterns = [
            '/(?:current\s+)?company\s*[:\-]\s*(.+)/i',

            '/employer\s*[:\-]\s*(.+)/i',

            '/organization\s*[:\-]\s*(.+)/i',

            '/working\s+at\s+(.+)/i',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return $this->cleanSingleLine(
                    $matches[1]
                );
            }
        }

        return null;
    }

    /**
     * Extract education.
     */
    private function extractEducation(
        string $text
    ): ?string {
        $educationKeywords = [
            'bachelor',
            'bsc',
            'b.sc',
            'beng',
            'b.eng',
            'master',
            'msc',
            'm.sc',
            'meng',
            'm.eng',
            'phd',
            'doctorate',
            'diploma',
            'higher secondary',
            'hsc',
            'ssc',
            'computer science',
            'computer engineering',
            'software engineering',
        ];

        $lines = preg_split(
            '/\n+/',
            $text
        );

        $education = [];

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            foreach (
                $educationKeywords
                as $keyword
            ) {
                if (
                    stripos(
                        $line,
                        $keyword
                    ) !== false
                ) {
                    $education[] = $line;

                    break;
                }
            }
        }

        if (empty($education)) {
            return null;
        }

        return implode(
            "\n",
            array_unique($education)
        );
    }

    /**
     * Extract technical skills.
     *
     * This uses a controlled dictionary rather
     * than treating every word in the resume
     * as a skill.
     */
    private function extractSkills(
        string $text
    ): array {
        $skills = [
            'PHP',
            'Laravel',
            'Symfony',

            'JavaScript',
            'TypeScript',
            'React',
            'React.js',
            'Vue.js',
            'Angular',
            'Next.js',

            'Node.js',
            'NestJS',
            'Express.js',

            'C',
            'C++',
            'C#',
            '.NET',
            '.NET Core',
            'ASP.NET',

            'Java',
            'Spring Boot',

            'Python',
            'Django',
            'FastAPI',

            'Flutter',
            'Dart',
            'Android',
            'Kotlin',

            'HTML',
            'CSS',
            'Tailwind CSS',
            'Bootstrap',

            'MySQL',
            'PostgreSQL',
            'SQL Server',
            'SQLite',
            'MongoDB',
            'Redis',

            'Docker',
            'Kubernetes',
            'AWS',
            'Azure',
            'GCP',

            'Git',
            'GitHub',
            'GitLab',

            'REST API',
            'GraphQL',

            'Linux',
            'Nginx',

            'Jenkins',
            'CI/CD',
        ];

        $found = [];

        foreach ($skills as $skill) {
            $pattern =
                '/(?<![a-zA-Z0-9])'
                . preg_quote(
                    $skill,
                    '/'
                )
                . '(?![a-zA-Z0-9])/i';

            if (
                preg_match(
                    $pattern,
                    $text
                )
            ) {
                $found[] = $skill;
            }
        }

        /*
         * Remove duplicate aliases.
         */
        return $this->normalizeSkills(
            $found
        );
    }

    /**
     * Normalize extracted skills.
     */
    private function normalizeSkills(
        array $skills
    ): array {
        $aliases = [
            'react.js' => 'React',
            'reactjs' => 'React',

            'nodejs' => 'Node.js',
            'node js' => 'Node.js',

            'nest.js' => 'NestJS',
            'nest js' => 'NestJS',

            '.net core' => '.NET',
            'dotnet' => '.NET',

            'mssql' => 'SQL Server',

            'postgres' => 'PostgreSQL',

            'js' => 'JavaScript',
            'ts' => 'TypeScript',
        ];

        $result = [];

        foreach ($skills as $skill) {
            $key = strtolower(
                trim($skill)
            );

            $normalized =
                $aliases[$key] ?? $skill;

            $result[
                strtolower($normalized)
            ] = $normalized;
        }

        return array_values($result);
    }

    /**
     * Extract notice period.
     */
    private function extractNoticePeriod(
        string $text
    ): ?string {
        $patterns = [
            '/notice\s+period\s*[:\-]\s*(.{1,50})/i',

            '/notice\s*[:\-]\s*(.{1,50})/i',

            '/(\d+)\s*(days?|weeks?|months?)\s*notice/i',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return $this->cleanSingleLine(
                    $matches[1]
                );
            }
        }

        return null;
    }

    /**
     * Extract current salary.
     */
    private function extractCurrentSalary(
        string $text
    ): ?string {
        $patterns = [
            '/current\s+salary\s*[:\-]\s*(.{1,100})/i',

            '/present\s+salary\s*[:\-]\s*(.{1,100})/i',

            '/current\s+ctc\s*[:\-]\s*(.{1,100})/i',

            '/current\s+compensation\s*[:\-]\s*(.{1,100})/i',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return $this->cleanSingleLine(
                    $matches[1]
                );
            }
        }

        return null;
    }

    /**
     * Extract expected salary.
     */
    private function extractExpectedSalary(
        string $text
    ): ?string {
        $patterns = [
            '/expected\s+salary\s*[:\-]\s*(.{1,100})/i',

            '/expected\s+ctc\s*[:\-]\s*(.{1,100})/i',

            '/salary\s+expectation\s*[:\-]\s*(.{1,100})/i',

            '/expected\s+compensation\s*[:\-]\s*(.{1,100})/i',
        ];

        foreach ($patterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return $this->cleanSingleLine(
                    $matches[1]
                );
            }
        }

        return null;
    }

    /**
     * Clean a single extracted line.
     */
    private function cleanSingleLine(
        string $value
    ): string {
        $value = preg_split(
            '/\n/',
            $value
        )[0];

        $value = preg_replace(
            '/\s+/',
            ' ',
            trim($value)
        );

        return trim(
            $value,
            " \t\n\r\0\x0B:"
        );
    }

    /**
     * Determine whether a line is an obvious
     * resume heading.
     */
    private function isHeading(
        string $line
    ): bool {
        $headings = [
            'resume',
            'curriculum vitae',
            'cv',
            'profile',
            'summary',
            'objective',
            'experience',
            'education',
            'skills',
            'projects',
            'contact',
            'contact information',
            'professional summary',
        ];

        return in_array(
            strtolower(
                trim($line)
            ),
            $headings,
            true
        );
    }
}