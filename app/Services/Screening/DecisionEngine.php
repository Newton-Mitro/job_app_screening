<?php

namespace App\Services\Screening;

class DecisionEngine
{
    /**
     * Score thresholds.
     */
    private array $thresholds = [
        'shortlisted' => 85,

        'manual_review' => 70,
    ];

    /**
     * Determine candidate decision.
     */
    public function decide(
        float $score,
        array $results
    ): array {
        $missingRequiredSkills =
            $results['skills']['required']['missing']
            ?? 0;

        /*
         * Mandatory skill failure.
         *
         * Don't automatically reject because
         * HR may want to manually review the
         * candidate.
         */
        if (
            $missingRequiredSkills > 0
        ) {
            if (
                $score >=
                $this->thresholds['shortlisted']
            ) {
                return [
                    'decision' =>
                        'manual_review',

                    'reason' =>
                        'Candidate has a strong overall score but is missing one or more required skills.',
                ];
            }
        }

        /*
         * Strong candidate.
         */
        if (
            $score >=
            $this->thresholds['shortlisted']
        ) {
            return [
                'decision' =>
                    'shortlisted',

                'reason' =>
                    'Candidate meets the required screening threshold.',
            ];
        }

        /*
         * Potential candidate.
         */
        if (
            $score >=
            $this->thresholds['manual_review']
        ) {
            return [
                'decision' =>
                    'manual_review',

                'reason' =>
                    'Candidate is close to the screening threshold and requires manual review.',
            ];
        }

        /*
         * Weak candidate.
         */
        return [
            'decision' =>
                'rejected',

            'reason' =>
                'Candidate score is below the minimum screening threshold.',
        ];
    }

    /**
     * Get decision thresholds.
     */
    public function getThresholds(): array
    {
        return $this->thresholds;
    }
}