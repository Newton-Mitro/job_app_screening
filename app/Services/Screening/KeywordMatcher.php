<?php

namespace App\Services\Screening;

use App\Models\Candidate;
use App\Models\Job;

class KeywordMatcher
{
    /**
     * Match job keywords against candidate information.
     */
    public function match(
        Candidate $candidate,
        Job $job
    ): array {
        $keywords =
            $this->getJobKeywords($job);

        if (empty($keywords)) {
            return [
                'total' => 0,

                'matched' => 0,

                'missing' => 0,

                'percentage' => 100,

                'matched_keywords' => [],

                'missing_keywords' => [],
            ];
        }

        $candidateText =
            $this->buildCandidateText(
                $candidate
            );

        $matched = [];
        $missing = [];

        foreach ($keywords as $keyword) {
            $keyword =
                strtolower(
                    trim($keyword)
                );

            if ($keyword === '') {
                continue;
            }

            if (
                str_contains(
                    $candidateText,
                    $keyword
                )
            ) {
                $matched[] = $keyword;
            } else {
                $missing[] = $keyword;
            }
        }

        $total =
            count($matched)
            + count($missing);

        $percentage =
            $total > 0
            ? round(
                (
                    count($matched)
                    / $total
                ) * 100,
                2
            )
            : 100;

        return [
            'total' =>
                $total,

            'matched' =>
                count($matched),

            'missing' =>
                count($missing),

            'percentage' =>
                $percentage,

            'matched_keywords' =>
                array_values(
                    array_unique($matched)
                ),

            'missing_keywords' =>
                array_values(
                    array_unique($missing)
                ),
        ];
    }

    /**
     * Get keywords from job.
     */
    private function getJobKeywords(
        Job $job
    ): array {
        if (
            isset($job->keywords)
            && is_array($job->keywords)
        ) {
            return $job->keywords;
        }

        return [];
    }

    /**
     * Build searchable candidate text.
     */
    private function buildCandidateText(
        Candidate $candidate
    ): string {
        $parts = [
            $candidate->full_name,
            $candidate->current_position,
            $candidate->current_company,
            $candidate->education_summary,
        ];

        /*
         * JSON skills.
         */
        if (
            is_array($candidate->skills)
        ) {
            $parts = array_merge(
                $parts,
                $candidate->skills
            );
        }

        /*
         * Candidate skills relation.
         */
        if (
            $candidate->relationLoaded('skills')
        ) {
            $parts = array_merge(
                $parts,
                $candidate
                    ->skills
                    ->pluck('name')
                    ->toArray()
            );
        }

        return strtolower(
            implode(
                ' ',
                array_filter($parts)
            )
        );
    }
}