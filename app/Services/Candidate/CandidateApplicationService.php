<?php

namespace App\Services\Candidate;

use App\Models\Application;
use App\Models\Candidate;
use App\Models\Job;
use App\Models\Resume;
use Illuminate\Support\Facades\DB;

class CandidateApplicationService
{
    /**
     * Create an application.
     */
    public function create(
        Candidate $candidate,
        Job $job,
        ?Resume $resume = null,
        ?string $status = 'received'
    ): Application {
        return DB::transaction(
            function () use ($candidate, $job, $resume, $status) {

                $application =
                    Application::query()
                        ->where(
                            'candidate_id',
                            $candidate->id
                        )
                        ->where(
                            'job_id',
                            $job->id
                        )
                        ->first();

                if ($application) {

                    if (
                        $resume
                        && $application->resume_id
                        !== $resume->id
                    ) {
                        $application->update([
                            'resume_id' =>
                                $resume->id,
                        ]);
                    }

                    return $application
                        ->refresh();
                }

                return Application::create([
                    'candidate_id' =>
                        $candidate->id,

                    'job_id' =>
                        $job->id,

                    'resume_id' =>
                        $resume?->id,

                    'status' =>
                        $status,

                    'applied_at' =>
                        now(),
                ]);
            }
        );
    }

    /**
     * Change application status.
     */
    public function updateStatus(
        Application $application,
        string $status
    ): Application {
        $allowedStatuses = [
            'received',
            'processing',
            'screened',
            'shortlisted',
            'manual_review',
            'rejected',
        ];

        if (
            !in_array(
                $status,
                $allowedStatuses,
                true
            )
        ) {
            throw new \InvalidArgumentException(
                "Invalid application status: {$status}"
            );
        }

        $application->update([
            'status' => $status,
        ]);

        return $application->refresh();
    }

    /**
     * Mark application as processing.
     */
    public function markProcessing(
        Application $application
    ): Application {
        return $this->updateStatus(
            $application,
            'processing'
        );
    }

    /**
     * Mark application as screened.
     */
    public function markScreened(
        Application $application
    ): Application {
        return $this->updateStatus(
            $application,
            'screened'
        );
    }

    /**
     * Shortlist candidate.
     */
    public function shortlist(
        Application $application
    ): Application {
        return $this->updateStatus(
            $application,
            'shortlisted'
        );
    }

    /**
     * Send application to manual review.
     */
    public function manualReview(
        Application $application
    ): Application {
        return $this->updateStatus(
            $application,
            'manual_review'
        );
    }

    /**
     * Reject application.
     */
    public function reject(
        Application $application
    ): Application {
        return $this->updateStatus(
            $application,
            'rejected'
        );
    }
}