<?php

namespace App\Services\Screening;

use App\Models\Candidate;
use App\Models\Job;

class ExperienceMatcher
{
    /**
     * Match candidate experience against job requirement.
     */
    public function match(
        Candidate $candidate,
        Job $job
    ): array {
        $candidateYears =
            (float) (
                $candidate->total_experience_years
                ?? 0
            );

        $requiredYears =
            (float) (
                $job->minimum_experience_years
                ?? 0
            );

        if ($requiredYears <= 0) {
            return [
                'candidate_years' =>
                    $candidateYears,

                'required_years' =>
                    0,

                'matched' =>
                    true,

                'percentage' =>
                    100,

                'gap' =>
                    0,
            ];
        }

        $gap = max(
            0,
            $requiredYears - $candidateYears
        );

        $matched =
            $candidateYears >= $requiredYears;

        /*
         * Don't allow the score to exceed 100.
         */
        $percentage = min(
            100,
            round(
                (
                    $candidateYears
                    / $requiredYears
                ) * 100,
                2
            )
        );

        return [
            'candidate_years' =>
                $candidateYears,

            'required_years' =>
                $requiredYears,

            'matched' =>
                $matched,

            'percentage' =>
                $percentage,

            'gap' =>
                round($gap, 1),
        ];
    }
}