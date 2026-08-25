<?php

namespace App\Services\Screening;

use App\Models\Candidate;
use App\Models\Job;

class EducationMatcher
{
    /**
     * Education hierarchy.
     */
    private array $levels = [
        'ssc' => 1,
        'hsc' => 2,
        'diploma' => 3,

        'bachelor' => 4,
        'bsc' => 4,
        'b.eng' => 4,
        'beng' => 4,
        'bachelor degree' => 4,

        'master' => 5,
        'msc' => 5,
        'm.eng' => 5,
        'meng' => 5,
        'master degree' => 5,

        'phd' => 6,
        'doctorate' => 6,
    ];

    /**
     * Match candidate education.
     */
    public function match(
        Candidate $candidate,
        Job $job
    ): array {
        $candidateEducation =
            strtolower(
                trim(
                    (string) (
                        $candidate
                            ->education_summary
                        ?? ''
                    )
                )
            );

        $requiredEducation =
            strtolower(
                trim(
                    (string) (
                        $job
                            ->minimum_education
                        ?? ''
                    )
                )
            );

        /*
         * No education requirement.
         */
        if ($requiredEducation === '') {
            return [
                'required' => null,

                'candidate' =>
                    $candidateEducation,

                'matched' => true,

                'percentage' => 100,
            ];
        }

        /*
         * We don't have candidate education.
         */
        if ($candidateEducation === '') {
            return [
                'required' =>
                    $requiredEducation,

                'candidate' =>
                    null,

                'matched' => false,

                'percentage' => 0,
            ];
        }

        $requiredLevel =
            $this->detectLevel(
                $requiredEducation
            );

        $candidateLevel =
            $this->detectLevel(
                $candidateEducation
            );

        /*
         * If levels cannot be determined,
         * use keyword matching.
         */
        if (
            $requiredLevel === 0
            || $candidateLevel === 0
        ) {
            return $this->keywordMatch(
                $candidateEducation,
                $requiredEducation
            );
        }

        $matched =
            $candidateLevel >= $requiredLevel;

        return [
            'required' =>
                $requiredEducation,

            'candidate' =>
                $candidateEducation,

            'required_level' =>
                $requiredLevel,

            'candidate_level' =>
                $candidateLevel,

            'matched' =>
                $matched,

            'percentage' =>
                $matched ? 100 : 0,
        ];
    }

    /**
     * Detect education level.
     */
    private function detectLevel(
        string $education
    ): int {
        $detected = 0;

        foreach ($this->levels as $keyword => $level) {
            if (
                str_contains(
                    $education,
                    $keyword
                )
            ) {
                $detected = max(
                    $detected,
                    $level
                );
            }
        }

        return $detected;
    }

    /**
     * Fallback keyword matching.
     */
    private function keywordMatch(
        string $candidate,
        string $required
    ): array {
        $requiredWords =
            preg_split(
                '/\s+/',
                $required
            );

        $matched = 0;

        foreach ($requiredWords as $word) {
            $word = trim($word);

            if (
                $word === ''
                || strlen($word) < 3
            ) {
                continue;
            }

            if (
                str_contains(
                    $candidate,
                    $word
                )
            ) {
                $matched++;
            }
        }

        $total = count(
            array_filter(
                $requiredWords,
                fn($word) =>
                strlen(trim($word)) >= 3
            )
        );

        $percentage =
            $total > 0
            ? round(
                ($matched / $total) * 100,
                2
            )
            : 0;

        return [
            'required' => $required,

            'candidate' => $candidate,

            'matched' =>
                $percentage >= 70,

            'percentage' =>
                $percentage,
        ];
    }
}