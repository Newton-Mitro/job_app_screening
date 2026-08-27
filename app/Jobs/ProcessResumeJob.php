<?php

namespace App\Jobs;

use App\Models\EmailAttachment;
use App\Models\Resume;
use App\Services\Candidate\CandidateService;
use App\Services\Resume\ResumeService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessResumeJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Number of attempts.
     */
    public int $tries = 3;

    /**
     * Maximum execution time.
     *
     * PDF parsing can take some time for large files.
     */
    public int $timeout = 300;

    /**
     * Retry delays.
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
        public readonly int $resumeId
    ) {
        $this->onQueue('resumes');
    }

    /**
     * Execute the job.
     */
    public function handle(
        ResumeService $resumeService,
        CandidateService $candidateService
    ): void {
        Log::info(
            'Starting resume processing job.',
            [
                'resume_id' => $this->resumeId,
            ]
        );

        $resume = EmailAttachment::query()
            ->find($this->resumeId);

        if (!$resume) {
            Log::warning(
                'Resume not found.',
                [
                    'resume_id' => $this->resumeId,
                ]
            );

            return;
        }

        /*
         * Prevent processing the same resume
         * unnecessarily.
         */
        if (
            $resume->parse_status === 'completed'
            && !empty($resume->extracted_text)
        ) {
            Log::info(
                'Resume already processed.',
                [
                    'resume_id' => $resume->id,
                ]
            );

            return;
        }

        try {
            /*
             * Step 1:
             * Parse the resume and extract text.
             */
            $resume =
                $resumeService->process(
                    $resume
                );

            /*
             * Step 2:
             * Extract structured candidate data
             * from the resume text.
             */
            $candidateData =
                $resumeService
                    ->extractCandidateData(
                        $resume
                    );

            Log::info(
                'Candidate data extracted from resume.',
                [
                    'resume_id' =>
                        $resume->id,

                    'name' =>
                        $candidateData['name']
                        ?? null,

                    'email' =>
                        $candidateData['email']
                        ?? null,

                    'experience_years' =>
                        $candidateData[
                            'experience_years'
                        ] ?? 0,

                    'skills_count' =>
                        count(
                            $candidateData['skills']
                            ?? []
                        ),
                ]
            );

            /*
             * Step 3:
             * Create or update candidate.
             */
            $candidate =
                $candidateService
                    ->createFromResume(
                        $resume,
                        $candidateData
                    );

            /*
             * Step 4:
             * Associate the resume with
             * the candidate if necessary.
             */
            if (
                $resume->candidate_id
                !== $candidate->id
            ) {
                $resume->update([
                    'candidate_id' =>
                        $candidate->id,
                ]);
            }

            Log::info(
                'Resume processing completed.',
                [
                    'resume_id' =>
                        $resume->id,

                    'candidate_id' =>
                        $candidate->id,

                    'candidate_name' =>
                        $candidate->full_name,
                ]
            );
        } catch (Throwable $e) {
            Log::error(
                'Resume processing job failed.',
                [
                    'resume_id' =>
                        $this->resumeId,

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
     * Handle permanent failure.
     */
    public function failed(
        ?Throwable $exception
    ): void {
        Log::critical(
            'Resume processing job permanently failed.',
            [
                'resume_id' =>
                    $this->resumeId,

                'error' =>
                    $exception?->getMessage(),
            ]
        );

        /*
         * Mark resume as failed if it still exists.
         */
        $resume = EmailAttachment::query()
            ->find($this->resumeId);

        if ($resume) {
            $resume->update([
                'parse_status' => 'failed',

                'parse_error' =>
                    $exception?->getMessage()
                    ?? 'Unknown processing error.',
            ]);
        }
    }
}