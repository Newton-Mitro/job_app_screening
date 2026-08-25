<?php

namespace App\Services\Resume;

use App\Models\Resume;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class ResumeService
{
    private const SUPPORTED_EXTENSIONS = [
        'pdf',
        'docx',
    ];

    private const SUPPORTED_MIME_TYPES = [
        'application/pdf',

        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    public function __construct(
        private readonly ResumeParserFactory $parserFactory,

        private readonly ResumeTextCleaner $textCleaner,

        private readonly ResumeDataExtractor $dataExtractor,
    ) {
    }

    /**
     * Store a resume file.
     */
    public function store(
        UploadedFile $file,
        ?int $candidateId = null
    ): Resume {
        $this->validateFile($file);

        $extension = strtolower(
            $file->getClientOriginalExtension()
        );

        $mimeType = $file->getMimeType();

        $storedFilename =
            Str::uuid()
            . '.'
            . $extension;

        $directory =
            'resumes/'
            . now()->format('Y/m');

        $path = $file->storeAs(
            $directory,
            $storedFilename,
            'local'
        );

        if (!$path) {
            throw new RuntimeException(
                'Failed to store resume file.'
            );
        }

        return Resume::create([
            'candidate_id' => $candidateId,

            'original_filename' =>
                $file->getClientOriginalName(),

            'stored_filename' =>
                $storedFilename,

            'path' => $path,

            'extension' => $extension,

            'mime_type' => $mimeType,

            'file_size' => $file->getSize(),

            'parse_status' => 'pending',
        ]);
    }

    /**
     * Process a stored resume.
     */
    public function process(
        Resume $resume
    ): Resume {
        $resume->update([
            'parse_status' => 'processing',
            'parse_error' => null,
        ]);

        try {
            $absolutePath =
                Storage::disk('local')
                    ->path($resume->path);

            $parser =
                $this->parserFactory->make(
                    $resume->extension,
                    $resume->mime_type
                );

            $rawText =
                $parser->extract(
                    $absolutePath
                );

            $cleanText =
                $this->textCleaner->clean(
                    $rawText
                );

            if ($cleanText === '') {
                throw new RuntimeException(
                    'Resume contains no readable text.'
                );
            }

            $resume->update([
                'extracted_text' => $cleanText,

                'parse_status' => 'completed',

                'parsed_at' => now(),

                'parse_error' => null,
            ]);

            return $resume->refresh();
        } catch (Throwable $e) {
            $resume->update([
                'parse_status' => 'failed',

                'parse_error' =>
                    $e->getMessage(),
            ]);

            Log::error(
                'Resume processing failed.',
                [
                    'resume_id' =>
                        $resume->id,

                    'path' =>
                        $resume->path,

                    'error' =>
                        $e->getMessage(),
                ]
            );

            throw $e;
        }
    }

    /**
     * Extract candidate information
     * from a processed resume.
     */
    public function extractCandidateData(
        Resume $resume
    ): array {
        if (
            empty($resume->extracted_text)
        ) {
            throw new RuntimeException(
                'Resume has not been parsed yet.'
            );
        }

        return $this->dataExtractor->extract(
            $resume->extracted_text
        );
    }

    /**
     * Delete a resume file and record.
     */
    public function delete(
        Resume $resume
    ): void {
        if (
            $resume->path
            && Storage::disk('local')->exists(
                $resume->path
            )
        ) {
            Storage::disk('local')->delete(
                $resume->path
            );
        }

        $resume->delete();
    }

    /**
     * Validate resume file.
     */
    private function validateFile(
        UploadedFile $file
    ): void {
        if (!$file->isValid()) {
            throw new RuntimeException(
                'Uploaded resume is invalid.'
            );
        }

        $extension = strtolower(
            $file->getClientOriginalExtension()
        );

        if (
            !in_array(
                $extension,
                self::SUPPORTED_EXTENSIONS,
                true
            )
        ) {
            throw new RuntimeException(
                "Unsupported resume extension: {$extension}"
            );
        }

        $mimeType = $file->getMimeType();

        if (
            !in_array(
                $mimeType,
                self::SUPPORTED_MIME_TYPES,
                true
            )
        ) {
            throw new RuntimeException(
                "Unsupported resume MIME type: {$mimeType}"
            );
        }

        // 10 MB maximum.
        if (
            $file->getSize()
            > 10 * 1024 * 1024
        ) {
            throw new RuntimeException(
                'Resume file cannot exceed 10 MB.'
            );
        }
    }

    public function storeFromPath(
        string $sourcePath,
        string $originalFilename,
        ?int $candidateId = null,
        ?string $mimeType = null
    ): Resume {
        if (!is_file($sourcePath)) {
            throw new RuntimeException(
                "Resume file does not exist: {$sourcePath}"
            );
        }

        $extension = strtolower(
            pathinfo(
                $originalFilename,
                PATHINFO_EXTENSION
            )
        );

        if (
            !in_array(
                $extension,
                self::SUPPORTED_EXTENSIONS,
                true
            )
        ) {
            throw new RuntimeException(
                "Unsupported resume extension: {$extension}"
            );
        }

        $detectedMimeType =
            $mimeType
            ?? mime_content_type($sourcePath);

        if (
            !in_array(
                $detectedMimeType,
                self::SUPPORTED_MIME_TYPES,
                true
            )
        ) {
            throw new RuntimeException(
                "Unsupported resume MIME type: {$detectedMimeType}"
            );
        }

        $storedFilename =
            Str::uuid()
            . '.'
            . $extension;

        $directory =
            'resumes/'
            . now()->format('Y/m');

        $destination =
            $directory
            . '/'
            . $storedFilename;

        Storage::disk('local')->put(
            $destination,
            file_get_contents($sourcePath)
        );

        return Resume::create([
            'candidate_id' => $candidateId,

            'original_filename' =>
                $originalFilename,

            'stored_filename' =>
                $storedFilename,

            'path' =>
                $destination,

            'extension' =>
                $extension,

            'mime_type' =>
                $detectedMimeType,

            'file_size' =>
                filesize($sourcePath),

            'parse_status' =>
                'pending',
        ]);
    }
}