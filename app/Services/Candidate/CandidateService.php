<?php

namespace App\Services\Candidate;

use App\Models\Candidate;
use App\Models\Resume;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class CandidateService
{
    public function __construct(
        private readonly CandidateNormalizer $normalizer,

        private readonly CandidateSkillService $skillService,
    ) {
    }

    /**
     * Create or update a candidate from
     * extracted resume data.
     */
    public function createFromResume(
        Resume $resume,
        array $data
    ): Candidate {
        $normalized =
            $this->normalizer->normalize(
                $data
            );

        return DB::transaction(
            function () use ($resume, $normalized) {

                $candidate =
                    $this->findExistingCandidate(
                        $normalized
                    );

                if ($candidate) {
                    $candidate->update([
                        'full_name' =>
                            $normalized['full_name']
                            ?? $candidate->full_name,

                        'email' =>
                            $normalized['email']
                            ?? $candidate->email,

                        'phone' =>
                            $normalized['phone']
                            ?? $candidate->phone,

                        'current_position' =>
                            $normalized[
                                'current_position'
                            ]
                            ?? $candidate->current_position,

                        'current_company' =>
                            $normalized[
                                'current_company'
                            ]
                            ?? $candidate->current_company,

                        'total_experience_years' =>
                            max(
                                $candidate
                                    ->total_experience_years,

                                $normalized[
                                    'total_experience_years'
                                ]
                            ),

                        'education_summary' =>
                            $normalized[
                                'education_summary'
                            ]
                            ?? $candidate
                                ->education_summary,

                        'skills' =>
                            $normalized['skills'],
                    ]);
                } else {
                    $candidate =
                        Candidate::create([
                            'full_name' =>
                                $normalized[
                                    'full_name'
                                ],

                            'email' =>
                                $normalized[
                                    'email'
                                ],

                            'phone' =>
                                $normalized[
                                    'phone'
                                ],

                            'current_position' =>
                                $normalized[
                                    'current_position'
                                ],

                            'current_company' =>
                                $normalized[
                                    'current_company'
                                ],

                            'total_experience_years' =>
                                $normalized[
                                    'total_experience_years'
                                ],

                            'education_summary' =>
                                $normalized[
                                    'education_summary'
                                ],

                            'skills' =>
                                $normalized['skills'],
                        ]);
                }

                $this->skillService->sync(
                    $candidate,
                    $normalized['skills'],
                    'resume'
                );

                return $candidate->refresh();
            }
        );
    }

    /**
     * Update candidate manually.
     */
    public function update(
        Candidate $candidate,
        array $data
    ): Candidate {
        $normalized =
            $this->normalizer->normalize(
                $data
            );

        DB::transaction(
            function () use ($candidate, $normalized) {
                $candidate->update([
                    'full_name' =>
                        $normalized['full_name'],

                    'email' =>
                        $normalized['email'],

                    'phone' =>
                        $normalized['phone'],

                    'current_position' =>
                        $normalized[
                            'current_position'
                        ],

                    'current_company' =>
                        $normalized[
                            'current_company'
                        ],

                    'total_experience_years' =>
                        $normalized[
                            'total_experience_years'
                        ],

                    'education_summary' =>
                        $normalized[
                            'education_summary'
                        ],

                    'skills' =>
                        $normalized['skills'],
                ]);

                $this->skillService->sync(
                    $candidate,
                    $normalized['skills'],
                    'manual'
                );
            }
        );

        return $candidate->refresh();
    }

    /**
     * Find candidate by email first.
     */
    private function findExistingCandidate(
        array $data
    ): ?Candidate {
        if (
            !empty($data['email'])
        ) {
            $candidate =
                Candidate::query()
                    ->where(
                        'email',
                        $data['email']
                    )
                    ->first();

            if ($candidate) {
                return $candidate;
            }
        }

        /*
         * We intentionally don't aggressively
         * match by name + phone because resumes
         * can contain unreliable information.
         *
         * Later we can add a dedicated
         * CandidateDuplicateService.
         */

        return null;
    }

    /**
     * Get candidate with all useful relations.
     */
    public function getDetails(
        Candidate $candidate
    ): Candidate {
        return $candidate
            ->load([
                'skills',
                'resumes',
                'applications.job',
                'applications.resume',
                'applications.screening',
            ]);
    }

    /**
     * Delete candidate.
     */
    public function delete(
        Candidate $candidate
    ): void {
        DB::transaction(
            function () use ($candidate) {
                $candidate->delete();
            }
        );
    }
}