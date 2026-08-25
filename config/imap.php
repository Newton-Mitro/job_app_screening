<?php

return [
    'host' => env('IMAP_HOST', 'imap.gmail.com'),
    'port' => env('IMAP_PORT', 993),
    'encryption' => env('IMAP_ENCRYPTION', 'ssl'),
    'validate_cert' => filter_var(
        env('IMAP_VALIDATE_CERT', true),
        FILTER_VALIDATE_BOOLEAN
    ),
    'username' => env('IMAP_USERNAME'),
    'password' => env('IMAP_PASSWORD'),
    'folder' => env('IMAP_FOLDER', 'INBOX'),
];