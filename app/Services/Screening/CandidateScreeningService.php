<?php

namespace App\Services\Screening;

use App\Models\Application;
use Illuminate\Support\Facades\DB;

class CandidateScreeningService
{
    public function __construct(
        private readonly SkillMatcher $skillMatcher,

        private readonly ExperienceMatcher $experienceMatcher,

        private readonly EducationMatcher $educationMatcher,

        private readonly KeywordMatcher $keywordMatcher,

        private readonly ScoreCalculator $scoreCalculator,

        private readonly DecisionEngine $decisionEngine,
    ) {
    }

    /**
     * Screen an application.
     */
    public function screen(
        Application $application
    ): array {
        $application->loadMissing([
            'candidate',
            'candidate.skills',
            'resume',
            'job',
            'job.skills',
        ]);

        $candidate =
            $application->candidate;

        $job =
            $application->job;

        if (!$candidate) {
            throw new \RuntimeException(
                'Application does not have a candidate.'
            );
        }

        if (!$job) {
            throw new \RuntimeException(
                'Application does not have a job.'
            );
        }

        /*
         * 1. Skill matching
         */
        $skillResult =
            $this->skillMatcher->match(
                $candidate,
                $job
            );

        /*
         * 2. Experience matching
         */
        $experienceResult =
            $this->experienceMatcher->match(
                $candidate,
                $job
            );

        /*
         * 3. Education matching
         */
        $educationResult =
            $this->educationMatcher->match(
                $candidate,
                $job
            );

        /*
         * 4. Keyword matching
         */
        $keywordResult =
            $this->keywordMatcher->match(
                $candidate,
                $job
            );

        $results = [
            'skills' =>
                $skillResult,

            'experience' =>
                $experienceResult,

            'education' =>
                $educationResult,

            'keywords' =>
                $keywordResult,
        ];

        /*
         * 5. Calculate final score.
         */
        $scoreResult =
            $this->scoreCalculator->calculate(
                $results
            );

        /*
         * 6. Determine decision.
         */
        $decisionResult =
            $this->decisionEngine->decide(
                $scoreResult['score'],
                $results
            );

        /*
         * 7. Build final result.
         */
        $finalResult = [
            'score' =>
                $scoreResult['score'],

            'decision' =>
                $decisionResult['decision'],

            'reason' =>
                $decisionResult['reason'],

            'breakdown' =>
                $scoreResult['breakdown'],

            'matched_skills' =>
                $skillResult['required']['matched_skills'],

            'missing_required_skills' =>
                $skillResult['required']['missing_skills'],

            'matched_preferred_skills' =>
                $skillResult['preferred']['matched_skills'],

            'missing_preferred_skills' =>
                $skillResult['preferred']['missing_skills'],

            'details' => [
                'skills' =>
                    $skillResult,

                'experience' =>
                    $experienceResult,

                'education' =>
                    $educationResult,

                'keywords' =>
                    $keywordResult,
            ],
        ];

        /*
         * 8. Persist screening result.
         */
        $this->saveResult(
            $application,
            $finalResult
        );

        return $finalResult;
    }

    /**
     * Save screening result.
     */
    private function saveResult(
        Application $application,
        array $result
    ): void {
        DB::transaction(
            function () use ($application, $result) {
                /*
                 * Create/update screening record.
                 */
                $application
                    ->screening()
                    ->updateOrCreate(
                        [
                            'application_id' =>
                                $application->id,
                        ],
                        [
                            'score' =>
                                $result['score'],

                            'decision' =>
                                $result['decision'],

                            'reason' =>
                                $result['reason'],

                            'breakdown' =>
                                $result['breakdown'],

                            'matched_skills' =>
                                $result[
                                    'matched_skills'
                                ],

                            'missing_skills' =>
                                $result[
                                    'missing_required_skills'
                                ],

                            'details' =>
                                $result['details'],
                        ]
                    );

                /*
                 * Update application status.
                 */
                $application->update([
                    'status' =>
                        $result['decision'],
                ]);
            }
        );
    }
}