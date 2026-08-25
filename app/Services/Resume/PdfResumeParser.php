<?php

namespace App\Services\Resume;

use RuntimeException;
use Smalot\PdfParser\Parser;
use Throwable;

class PdfResumeParser implements ResumeParserInterface
{
    public function __construct(
        private readonly Parser $parser = new Parser()
    ) {
    }

    /**
     * Determine whether this parser supports PDF.
     */
    public function supports(
        string $extension,
        ?string $mimeType = null
    ): bool {
        return strtolower($extension) === 'pdf'
            || $mimeType === 'application/pdf';
    }

    /**
     * Extract text from PDF.
     */
    public function extract(string $filePath): string
    {
        if (!is_file($filePath)) {
            throw new RuntimeException(
                "Resume file does not exist: {$filePath}"
            );
        }

        try {
            $pdf = $this->parser->parseFile($filePath);

            $text = $pdf->getText();

            if (trim($text) === '') {
                throw new RuntimeException(
                    'No text could be extracted from the PDF.'
                );
            }

            return $text;
        } catch (Throwable $e) {
            throw new RuntimeException(
                'Failed to extract text from PDF: '
                . $e->getMessage(),
                previous: $e
            );
        }
    }
}