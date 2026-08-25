<?php

namespace App\Services\Screening;

use App\Models\Candidate;
use App\Models\Job;

class SkillMatcher
{
    /**
     * Compare candidate skills against job skills.
     */
    public function match(
        Candidate $candidate,
        Job $job
    ): array {
        $candidateSkills =
            $this->normalizeSkills(
                $this->getCandidateSkills(
                    $candidate
                )
            );

        $requiredSkills =
            $this->normalizeSkills(
                $this->getJobSkills(
                    $job,
                    'required'
                )
            );

        $preferredSkills =
            $this->normalizeSkills(
                $this->getJobSkills(
                    $job,
                    'preferred'
                )
            );

        $matchedRequired =
            array_values(
                array_intersect(
                    $requiredSkills,
                    $candidateSkills
                )
            );

        $missingRequired =
            array_values(
                array_diff(
                    $requiredSkills,
                    $candidateSkills
                )
            );

        $matchedPreferred =
            array_values(
                array_intersect(
                    $preferredSkills,
                    $candidateSkills
                )
            );

        $missingPreferred =
            array_values(
                array_diff(
                    $preferredSkills,
                    $candidateSkills
                )
            );

        $requiredPercentage =
            count($requiredSkills) > 0
            ? round(
                (
                    count($matchedRequired)
                    / count($requiredSkills)
                ) * 100,
                2
            )
            : 100;

        $preferredPercentage =
            count($preferredSkills) > 0
            ? round(
                (
                    count($matchedPreferred)
                    / count($preferredSkills)
                ) * 100,
                2
            )
            : 100;

        return [
            'required' => [
                'total' =>
                    count($requiredSkills),

                'matched' =>
                    count($matchedRequired),

                'missing' =>
                    count($missingRequired),

                'percentage' =>
                    $requiredPercentage,

                'matched_skills' =>
                    $matchedRequired,

                'missing_skills' =>
                    $missingRequired,
            ],

            'preferred' => [
                'total' =>
                    count($preferredSkills),

                'matched' =>
                    count($matchedPreferred),

                'missing' =>
                    count($missingPreferred),

                'percentage' =>
                    $preferredPercentage,

                'matched_skills' =>
                    $matchedPreferred,

                'missing_skills' =>
                    $missingPreferred,
            ],
        ];
    }

    /**
     * Get candidate skills.
     */
    private function getCandidateSkills(
        Candidate $candidate
    ): array {
        /*
         * Prefer normalized candidate_skills
         * relationship.
         */
        if (
            $candidate->relationLoaded('skills')
        ) {
            return $candidate
                ->skills
                ->pluck('normalized_name')
                ->toArray();
        }

        /*
         * Fallback to JSON skills column.
         */
        return is_array($candidate->skills)
            ? $candidate->skills
            : [];
    }

    /**
     * Get job skills.
     */
    private function getJobSkills(
        Job $job,
        string $type
    ): array {
        if (
            $job->relationLoaded('skills')
        ) {
            return $job
                ->skills
                ->filter(
                    fn($skill) =>
                    ($skill->type ?? 'required')
                    === $type
                )
                ->pluck('normalized_name')
                ->toArray();
        }

        return [];
    }

    /**
     * Normalize skill names.
     */
    private function normalizeSkills(
        array $skills
    ): array {
        $aliases = [
            'react.js' => 'react',
            'reactjs' => 'react',

            'nodejs' => 'node.js',
            'node js' => 'node.js',

            'nest.js' => 'nestjs',
            'nest js' => 'nestjs',

            'dotnet' => '.net',
            'dot net' => '.net',
            '.net core' => '.net',

            'mssql' => 'sql server',
            'ms sql' => 'sql server',

            'postgres' => 'postgresql',

            'js' => 'javascript',
            'ts' => 'typescript',

            'c sharp' => 'c#',
            'c-sharp' => 'c#',
        ];

        $result = [];

        foreach ($skills as $skill) {
            if (!is_string($skill)) {
                continue;
            }

            $skill = strtolower(
                trim($skill)
            );

            if ($skill === '') {
                continue;
            }

            $skill =
                $aliases[$skill] ?? $skill;

            $result[$skill] = $skill;
        }

        return array_values($result);
    }
}