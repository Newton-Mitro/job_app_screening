<?php

namespace App\Services\Resume;

use PhpOffice\PhpWord\IOFactory;
use RuntimeException;
use Throwable;

class DocxResumeParser implements ResumeParserInterface
{
    public function supports(
        string $extension,
        ?string $mimeType = null
    ): bool {
        return strtolower($extension) === 'docx'
            || $mimeType ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    /**
     * Extract text from DOCX.
     */
    public function extract(string $filePath): string
    {
        if (!is_file($filePath)) {
            throw new RuntimeException(
                "Resume file does not exist: {$filePath}"
            );
        }

        try {
            $phpWord = IOFactory::load(
                $filePath,
                'Word2007'
            );

            $text = '';

            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    $text .= $this->extractElementText(
                        $element
                    );

                    $text .= PHP_EOL;
                }
            }

            $text = trim($text);

            if ($text === '') {
                throw new RuntimeException(
                    'No text could be extracted from the DOCX file.'
                );
            }

            return $text;
        } catch (Throwable $e) {
            throw new RuntimeException(
                'Failed to extract text from DOCX: '
                . $e->getMessage(),
                previous: $e
            );
        }
    }

    /**
     * Extract text from a PHPWord element.
     */
    private function extractElementText(
        mixed $element
    ): string {
        if (
            method_exists($element, 'getText')
        ) {
            $text = $element->getText();

            if (is_string($text)) {
                return $text;
            }
        }

        if (
            method_exists($element, 'getElements')
        ) {
            $text = '';

            foreach (
                $element->getElements()
                as $child
            ) {
                $text .= $this->extractElementText(
                    $child
                );
            }

            return $text;
        }

        return '';
    }
}