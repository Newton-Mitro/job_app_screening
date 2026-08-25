<?php

namespace App\Services\Candidate;

class CandidateNormalizer
{
    /**
     * Normalize candidate data.
     */
    public function normalize(array $data): array
    {
        return [
            'full_name' => $this->normalizeName(
                $data['name'] ?? null
            ),

            'email' => $this->normalizeEmail(
                $data['email'] ?? null
            ),

            'phone' => $this->normalizePhone(
                $data['phone'] ?? null
            ),

            'current_position' =>
                $this->normalizeText(
                    $data['current_position'] ?? null
                ),

            'current_company' =>
                $this->normalizeText(
                    $data['current_company'] ?? null
                ),

            'total_experience_years' =>
                $this->normalizeExperience(
                    $data['experience_years'] ?? 0
                ),

            'education_summary' =>
                $this->normalizeText(
                    $data['education'] ?? null
                ),

            'skills' =>
                $this->normalizeSkills(
                    $data['skills'] ?? []
                ),
        ];
    }

    /**
     * Normalize candidate name.
     */
    private function normalizeName(
        ?string $name
    ): ?string {
        if (!$name) {
            return null;
        }

        $name = trim($name);

        $name = preg_replace(
            '/\s+/',
            ' ',
            $name
        );

        return $name !== ''
            ? $name
            : null;
    }

    /**
     * Normalize email.
     */
    private function normalizeEmail(
        ?string $email
    ): ?string {
        if (!$email) {
            return null;
        }

        $email = strtolower(
            trim($email)
        );

        return filter_var(
            $email,
            FILTER_VALIDATE_EMAIL
        )
            ? $email
            : null;
    }

    /**
     * Normalize phone number.
     */
    private function normalizePhone(
        ?string $phone
    ): ?string {
        if (!$phone) {
            return null;
        }

        $phone = trim($phone);

        $phone = preg_replace(
            '/[\s\-().]+/',
            '',
            $phone
        );

        return $phone !== ''
            ? $phone
            : null;
    }

    /**
     * Normalize experience.
     */
    private function normalizeExperience(
        mixed $experience
    ): float {
        if (
            !is_numeric($experience)
        ) {
            return 0;
        }

        return max(
            0,
            round(
                (float) $experience,
                1
            )
        );
    }

    /**
     * Normalize text.
     */
    private function normalizeText(
        ?string $value
    ): ?string {
        if (!$value) {
            return null;
        }

        $value = trim($value);

        $value = preg_replace(
            '/\s+/',
            ' ',
            $value
        );

        return $value !== ''
            ? $value
            : null;
    }

    /**
     * Normalize skills.
     */
    private function normalizeSkills(
        array $skills
    ): array {
        $result = [];

        foreach ($skills as $skill) {
            if (!is_string($skill)) {
                continue;
            }

            $skill = trim($skill);

            if ($skill === '') {
                continue;
            }

            $normalized =
                $this->normalizeSkillName(
                    $skill
                );

            $result[$normalized] = $skill;
        }

        return array_values($result);
    }

    /**
     * Normalize skill aliases.
     */
    public function normalizeSkillName(
        string $skill
    ): string {
        $skill = strtolower(
            trim($skill)
        );

        $aliases = [
            'react.js' => 'react',
            'reactjs' => 'react',

            'nodejs' => 'node.js',
            'node js' => 'node.js',

            'nest.js' => 'nestjs',
            'nest js' => 'nestjs',

            'typescript.js' => 'typescript',

            '.net core' => '.net',
            'dotnet' => '.net',
            'dot net' => '.net',

            'ms sql' => 'sql server',
            'mssql' => 'sql server',

            'postgres' => 'postgresql',

            'mongo' => 'mongodb',

            'js' => 'javascript',
            'ts' => 'typescript',

            'c sharp' => 'c#',
            'c-sharp' => 'c#',

            'flutter framework' => 'flutter',
        ];

        return $aliases[$skill] ?? $skill;
    }
}