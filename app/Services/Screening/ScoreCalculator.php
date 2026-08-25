<?php

namespace App\Services\Screening;

class ScoreCalculator
{
    /**
     * Default scoring weights.
     */
    private array $weights = [
        'skills' => 50,

        'experience' => 25,

        'education' => 15,

        'keywords' => 10,
    ];

    /**
     * Calculate final score.
     */
    public function calculate(
        array $results
    ): array {
        $skillsPercentage =
            $this->getPercentage(
                $results,
                'skills'
            );

        $experiencePercentage =
            $this->getPercentage(
                $results,
                'experience'
            );

        $educationPercentage =
            $this->getPercentage(
                $results,
                'education'
            );

        $keywordsPercentage =
            $this->getPercentage(
                $results,
                'keywords'
            );

        $skillScore =
            (
                $skillsPercentage / 100
            ) * $this->weights['skills'];

        $experienceScore =
            (
                $experiencePercentage / 100
            ) * $this->weights['experience'];

        $educationScore =
            (
                $educationPercentage / 100
            ) * $this->weights['education'];

        $keywordScore =
            (
                $keywordsPercentage / 100
            ) * $this->weights['keywords'];

        $total =
            $skillScore
            + $experienceScore
            + $educationScore
            + $keywordScore;

        return [
            'score' =>
                round(
                    min(100, $total),
                    2
                ),

            'breakdown' => [
                'skills' => [
                    'percentage' =>
                        $skillsPercentage,

                    'weight' =>
                        $this->weights['skills'],

                    'score' =>
                        round(
                            $skillScore,
                            2
                        ),
                ],

                'experience' => [
                    'percentage' =>
                        $experiencePercentage,

                    'weight' =>
                        $this->weights['experience'],

                    'score' =>
                        round(
                            $experienceScore,
                            2
                        ),
                ],

                'education' => [
                    'percentage' =>
                        $educationPercentage,

                    'weight' =>
                        $this->weights['education'],

                    'score' =>
                        round(
                            $educationScore,
                            2
                        ),
                ],

                'keywords' => [
                    'percentage' =>
                        $keywordsPercentage,

                    'weight' =>
                        $this->weights['keywords'],

                    'score' =>
                        round(
                            $keywordScore,
                            2
                        ),
                ],
            ],
        ];
    }

    /**
     * Get percentage from result.
     */
    private function getPercentage(
        array $results,
        string $key
    ): float {
        return (float) (
            $results[$key]['percentage']
            ?? 0
        );
    }

    /**
     * Get scoring weights.
     */
    public function getWeights(): array
    {
        return $this->weights;
    }
}