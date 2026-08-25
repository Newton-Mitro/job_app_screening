<?php

namespace App\Jobs;

use App\Services\Email\EmailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessEmailJob implements ShouldQueue
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
     * Backoff between failed attempts.
     */
    public array $backoff = [
        30,
        60,
        120,
    ];

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->onQueue('emails');
    }

    /**
     * Execute the job.
     */
    public function handle(
        EmailService $emailService
    ): void {
        Log::info(
            'Starting email processing job.'
        );

        try {
            $result =
                $emailService
                    ->fetchApplicationEmails();

            Log::info(
                'Email processing job completed.',
                [
                    'total' =>
                        $result['total'] ?? 0,

                    'processed' =>
                        $result['processed'] ?? 0,

                    'skipped' =>
                        $result['skipped'] ?? 0,

                    'failed' =>
                        $result['failed'] ?? 0,
                ]
            );
        } catch (Throwable $e) {
            Log::error(
                'Email processing job failed.',
                [
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
     * Handle a job failure after all retries.
     */
    public function failed(
        ?Throwable $exception
    ): void {
        Log::critical(
            'Email processing job permanently failed.',
            [
                'error' =>
                    $exception?->getMessage(),
            ]
        );
    }
}