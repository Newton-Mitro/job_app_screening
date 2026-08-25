<?php

namespace App\Jobs;

use App\Models\Application;
use App\Services\Screening\ScreeningService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ScreenCandidateJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Maximum number of attempts.
     */
    public int $tries = 3;

    /**
     * Maximum execution time in seconds.
     */
    public int $timeout = 300;

    /**
     * Retry delays in seconds.
     */
    public array $backoff = [
        30,
        60,
        120,
    ];

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly int $applicationId
    ) {
        $this->onQueue('screening');
    }

    /**
     * Execute the job.
     */
    public function handle(
        ScreeningService $screeningService
    ): void {
        Log::info(
            'Starting candidate screening job.',
            [
                'application_id' =>
                    $this->applicationId,
            ]
        );

        $application = Application::query()
            ->with([
                'candidate',
                'candidate.skills',
                'resume',
                'job',
                'job.skills',
            ])
            ->find($this->applicationId);

        if (!$application) {
            Log::warning(
                'Application not found for screening.',
                [
                    'application_id' =>
                        $this->applicationId,
                ]
            );

            return;
        }

        /*
         * Prevent screening an already completed
         * application unnecessarily.
         */
        if (
            $application->status === 'shortlisted'
            || $application->status === 'rejected'
        ) {
            Log::info(
                'Application has already been finalized.',
                [
                    'application_id' =>
                        $application->id,

                    'status' =>
                        $application->status,
                ]
            );

            return;
        }

        try {
            /*
             * Mark application as processing.
             */
            $application->update([
                'status' => 'processing',
            ]);

            /*
             * Run the screening engine.
             */
            $result =
                $screeningService->screen(
                    $application
                );

            /*
             * Log the screening result.
             */
            Log::info(
                'Candidate screening completed.',
                [
                    'application_id' =>
                        $application->id,

                    'candidate_id' =>
                        $application->candidate_id,

                    'job_id' =>
                        $application->job_id,

                    'score' =>
                        $result['score']
                        ?? null,

                    'decision' =>
                        $result['decision']
                        ?? null,
                ]
            );
        } catch (Throwable $e) {
            /*
             * Put the application into manual review
             * instead of silently leaving it as processing.
             */
            $application->update([
                'status' => 'manual_review',
            ]);

            Log::error(
                'Candidate screening failed.',
                [
                    'application_id' =>
                        $application->id,

                    'candidate_id' =>
                        $application->candidate_id,

                    'job_id' =>
                        $application->job_id,

                    'error' =>
                        $e->getMessage(),

                    'file' =>
                        $e->getFile(),

                    'line' =>
                        $e->getLine(),
                ]
            );

            throw $e;
        }
    }

    /**
     * Handle permanent job failure.
     */
    public function failed(
        ?Throwable $exception
    ): void {
        Log::critical(
            'Candidate screening job permanently failed.',
            [
                'application_id' =>
                    $this->applicationId,

                'error' =>
                    $exception?->getMessage(),
            ]
        );

        $application = Application::query()
            ->find($this->applicationId);

        if ($application) {
            $application->update([
                'status' => 'manual_review',
            ]);
        }
    }
}