<?php

namespace App\Services\Email;

use App\Models\Application;
use App\Models\Candidate;
use App\Models\CandidateSkill;
use App\Models\Job;
use App\Models\JobCircular;
use App\Models\Resume;
use App\Services\Resume\ResumeService;
use App\Services\Screening\CandidateScreeningService;
use BaconQrCode\Exception\RuntimeException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class EmailService
{
    public function __construct(
        private readonly ImapService $imapService,
        private readonly EmailApplicationParser $emailApplicationParser,
        private readonly ResumeService $resumeService,
    ) {
    }

    /**
     * Fetch and process unread application emails.
     */
    public function fetchApplicationEmails(): array
    {
        $result = [
            'total' => 0,
            'processed' => 0,
            'skipped' => 0,
            'failed' => 0,
        ];

        try {
            $messages = $this->imapService->getUnreadMessages();


            $result['total'] = $messages->count();

            foreach ($messages as $message) {
                try {
                    $processed = $this->processMessage(
                        $message
                    );

                    if ($processed) {
                        $result['processed']++;
                    } else {
                        $result['skipped']++;
                    }
                } catch (Throwable $e) {
                    $result['failed']++;

                    Log::error(
                        'Failed to process application email.',
                        [
                            'error' => $e->getMessage(),
                        ]
                    );
                }
            }
        } finally {
            $this->imapService->disconnect();
        }

        return $result;
    }

    /**
     * Process one email message.
     */
    private function processMessage(
        mixed $message
    ): bool {
        $subject = $this->getSubject(
            $message
        );



        if (
            !$this->emailApplicationParser
                ->isApplicationEmail($subject)
        ) {
            return false;
        }



        $applicationData =
            $this->emailApplicationParser
                ->parseSubject($subject);



        $job = JobCircular::query()
            ->where(
                'code',
                $applicationData['job_code']
            )
            ->first();

        // if (!$job) {
        //     Log::warning(
        //         'Job not found for application email.',
        //         [
        //             'job_code' =>
        //                 $applicationData['job_code'],

        //             'subject' =>
        //                 $subject,
        //         ]
        //     );

        //     return false;
        // }

        $attachments = $message->getAttachments();


        if ($attachments->count() === 0) {
            Log::info(
                'Application email has no attachments.',
                [
                    'subject' => $subject,
                ]
            );

            return false;
        }



        // Log::info(
        //     'Application email detected.',
        //     [
        //         'job_id' => $job->id,

        //         'job_code' => $job->code,

        //         'job_title' => $job->title,

        //         'subject' => $subject,

        //         'attachments_count' =>
        //             $attachments->count(),
        //     ]
        // );



        foreach ($attachments as $attachment) {

            $this->processAttachment(
                $attachment,
                $job
            );
        }



        $this->imapService->markAsRead(
            $message
        );

        return true;
    }

    /**
     * Get email subject safely.
     */
    private function getSubject(
        mixed $message
    ): string {
        try {
            return (string) $message
                ->getSubject()
                ->first();
        } catch (Throwable) {
            return '';
        }
    }

    /**
     * Process attachment.
     */
    private function processAttachment(
        mixed $attachment,
        JobCircular $job
    ): void {
        $filename = $attachment->getName();

        $extension = strtolower(
            pathinfo(
                $filename,
                PATHINFO_EXTENSION
            )
        );

        if ($extension !== 'pdf') {
            Log::info(
                'Unsupported attachment ignored.',
                [
                    'filename' => $filename,
                    'extension' => $extension,
                ]
            );

            return;
        }

        Log::info(
            'PDF resume attachment detected.',
            [
                'filename' => $filename,
                'job_id' => $job->id,
                'job_title' => $job->title,
            ]
        );

        try {
            /*
             * ---------------------------------------------------------
             * 1. Generate unique filename
             * ---------------------------------------------------------
             */

            $storedFilename = Str::uuid() . '.pdf';

            $directory = 'resumes';

            $relativePath =
                $directory . '/' . $storedFilename;

            $disk = Storage::disk('local');

            $disk->makeDirectory($directory);

            $directoryPath = $disk->path($directory);

            // Save attachment using its original filename
            $attachment->save($directoryPath);

            $originalFilename = $attachment->getName();

            $originalPath =
                $directory . '/' . $originalFilename;

            // Rename to UUID filename
            $disk->move(
                $originalPath,
                $relativePath
            );

            Log::info('Resume saved successfully.', [
                'path' => $relativePath,
            ]);

            /*
             * ---------------------------------------------------------
             * 3. Verify file exists
             * ---------------------------------------------------------
             */

            if (
                !Storage::disk('local')->exists(
                    $relativePath
                )
            ) {

                throw new RuntimeException(
                    'Resume file was not saved successfully.'
                );
            }

            /*
             * ---------------------------------------------------------
             * 4. Create Resume record
             * ---------------------------------------------------------
             */


            $resume = Resume::create([
                'candidate_id' => null,

                'original_filename' => $filename,

                'stored_filename' => $storedFilename,

                'path' => $relativePath,

                'extension' => $extension,

                'mime_type' => 'application/pdf',

                'file_size' =>
                    Storage::disk('local')
                        ->size($relativePath),

                'parse_status' => 'pending',
            ]);



            Log::info(
                'Resume stored successfully.',
                [
                    'resume_id' => $resume->id,
                    'path' => $relativePath,
                ]
            );

            /*
             * ---------------------------------------------------------
             * 5. Extract PDF text
             * ---------------------------------------------------------
             */

            $text = $this->extractPdfText(
                Storage::disk('local')->path(
                    $relativePath
                )
            );

            dd($text);

            if (blank($text)) {
                $resume->update([
                    'parse_status' => 'failed',
                    'parse_error' =>
                        'Unable to extract text from PDF.',
                ]);

                Log::warning(
                    'Resume PDF contains no extractable text.',
                    [
                        'resume_id' => $resume->id,
                        'filename' => $filename,
                    ]
                );

                return;
            }

            /*
             * ---------------------------------------------------------
             * 6. Update extracted text
             * ---------------------------------------------------------
             */

            $resume->update([
                'extracted_text' => $text,
                'parse_status' => 'completed',
                'parsed_at' => now(),
            ]);

            /*
             * ---------------------------------------------------------
             * 7. Extract candidate information
             * ---------------------------------------------------------
             */

            $candidateData =
                $this->extractCandidateData($text);

            /*
             * ---------------------------------------------------------
             * 8. Create / find candidate
             * ---------------------------------------------------------
             */

            $candidate = Candidate::query()
                ->where(
                    'email',
                    $candidateData['email']
                )
                ->first();

            if (!$candidate) {
                $candidate = Candidate::create([
                    'full_name' =>
                        $candidateData['full_name'],

                    'email' =>
                        $candidateData['email'],

                    'phone' =>
                        $candidateData['phone'],

                    'address' =>
                        $candidateData['address'],

                    'education' =>
                        $candidateData['education'],

                    'current_position' =>
                        $candidateData['current_position'],

                    'current_company' =>
                        $candidateData['current_company'],

                    'total_experience_years' =>
                        $candidateData['total_experience_years'],

                    'skills' =>
                        $candidateData['skills'],
                ]);
            }

            /*
             * ---------------------------------------------------------
             * 9. Attach resume to candidate
             * ---------------------------------------------------------
             */

            $resume->update([
                'candidate_id' => $candidate->id,
            ]);

            /*
             * ---------------------------------------------------------
             * 10. Create application
             * ---------------------------------------------------------
             */

            $application =
                Application::firstOrCreate(
                    [
                        'candidate_id' =>
                            $candidate->id,

                        'job_circular_id' =>
                            $job->id,
                    ],
                    [
                        'resume_id' =>
                            $resume->id,

                        'status' =>
                            'received',

                        'applied_at' =>
                            now(),
                    ]
                );

            /*
             * ---------------------------------------------------------
             * 11. Create candidate skills
             * ---------------------------------------------------------
             */

            foreach (
                $candidateData['skills']
                as $skill
            ) {
                $normalizedName =
                    Str::lower(
                        trim($skill)
                    );

                if (
                    blank($normalizedName)
                ) {
                    continue;
                }

                CandidateSkill::firstOrCreate(
                    [
                        'candidate_id' =>
                            $candidate->id,

                        'normalized_name' =>
                            $normalizedName,
                    ],
                    [
                        'name' =>
                            trim($skill),

                        'source' =>
                            'resume',
                    ]
                );
            }

            /*
             * ---------------------------------------------------------
             * 12. Run screening
             * ---------------------------------------------------------
             */

            app(CandidateScreeningService::class)
                ->screen($application);

            Log::info(
                'Candidate application processed successfully.',
                [
                    'candidate_id' =>
                        $candidate->id,

                    'resume_id' =>
                        $resume->id,

                    'application_id' =>
                        $application->id,

                    'job_id' =>
                        $job->id,
                ]
            );
        } catch (Throwable $e) {
            Log::error(
                'Failed to process resume attachment.',
                [
                    'filename' => $filename,

                    'job_id' => $job->id,

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
}