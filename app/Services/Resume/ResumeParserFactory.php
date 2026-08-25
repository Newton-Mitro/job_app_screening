<?php

namespace App\Services\Resume;

use InvalidArgumentException;

class ResumeParserFactory
{
    /**
     * @var ResumeParserInterface[]
     */
    private array $parsers;

    public function __construct(
        PdfResumeParser $pdfParser,
        DocxResumeParser $docxParser,
    ) {
        $this->parsers = [
            $pdfParser,
            $docxParser,
        ];
    }

    /**
     * Get parser for a resume.
     */
    public function make(
        string $extension,
        ?string $mimeType = null
    ): ResumeParserInterface {
        foreach ($this->parsers as $parser) {
            if (
                $parser->supports(
                    $extension,
                    $mimeType
                )
            ) {
                return $parser;
            }
        }

        throw new InvalidArgumentException(
            "Unsupported resume format: {$extension}"
        );
    }

    /**
     * Determine whether a file is supported.
     */
    public function supports(
        string $extension,
        ?string $mimeType = null
    ): bool {
        foreach ($this->parsers as $parser) {
            if (
                $parser->supports(
                    $extension,
                    $mimeType
                )
            ) {
                return true;
            }
        }

        return false;
    }
}