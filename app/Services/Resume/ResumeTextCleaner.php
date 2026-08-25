<?php

namespace App\Services\Resume;

class ResumeTextCleaner
{
    /**
     * Clean extracted resume text.
     */
    public function clean(string $text): string
    {
        // Normalize line endings.
        $text = str_replace(
            ["\r\n", "\r"],
            "\n",
            $text
        );

        // Replace non-breaking spaces.
        $text = str_replace(
            "\xc2\xa0",
            ' ',
            $text
        );

        // Normalize tabs.
        $text = str_replace(
            "\t",
            ' ',
            $text
        );

        // Remove excessive spaces.
        $text = preg_replace(
            '/[ ]{2,}/',
            ' ',
            $text
        );

        // Remove excessive blank lines.
        $text = preg_replace(
            "/\n{3,}/",
            "\n\n",
            $text
        );

        // Trim every line.
        $lines = explode(
            "\n",
            $text
        );

        $lines = array_map(
            'trim',
            $lines
        );

        $text = implode(
            "\n",
            $lines
        );

        return trim($text);
    }
}