<?php

namespace App\Console\Commands;

use App\Jobs\ProcessEmailJob;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:fetch-application-emails')]
#[Description('Fetch and process job application emails')]
class FetchApplicationEmails extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        ProcessEmailJob::dispatch();

        $this->info(
            'Email processing job dispatched.'
        );

        return self::SUCCESS;
    }
}