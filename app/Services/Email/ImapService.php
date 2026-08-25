<?php

namespace App\Services\Email;

use RuntimeException;
use Webklex\PHPIMAP\Client;
use Webklex\PHPIMAP\ClientManager;
use Webklex\PHPIMAP\Support\MessageCollection;

class ImapService
{
    private Client $client;

    public function __construct()
    {
        $this->client = $this->createClient();
    }

    /**
     * Create the IMAP client.
     */
    private function createClient(): Client
    {
        $username = config('imap.username');
        $password = config('imap.password');

        if (empty($username) || empty($password)) {
            throw new RuntimeException(
                'MAIL_USERNAME or MAIL_PASSWORD is not configured.'
            );
        }

        $config = [
            'host' => config('imap.host'),
            'port' => (int) config(
                'imap.port',
                993
            ),
            // 'encryption' => config(
            //     'imap.encryption',
            //     'ssl'
            // ),
            // 'validate_cert' => config(
            //     'imap.validate_cert',
            //     true
            // ),
            'username' => config(
                'imap.username'
            ),
            'password' => config(
                'imap.password'
            ),
            'protocol' => 'imap',
        ];

        $manager = new ClientManager();

        return $manager->make($config);
    }

    /**
     * Connect to the IMAP server.
     */
    public function connect(): void
    {
        if (!$this->client->isConnected()) {
            $this->client->connect();
        }
    }

    /**
     * Disconnect from the IMAP server.
     */
    public function disconnect(): void
    {
        if ($this->client->isConnected()) {
            $this->client->disconnect();
        }
    }

    /**
     * Get unread messages from the configured folder.
     */
    public function getUnreadMessages(): MessageCollection
    {
        $this->connect();

        $folderName = config('imap.folder', 'INBOX');

        $folder = $this->client->getFolder(
            $folderName
        );

        return $folder
            ->query()
            ->unseen()
            ->get();
    }

    /**
     * Mark a message as read.
     */
    public function markAsRead(
        mixed $message
    ): void {
        $message->setFlag('Seen');
    }

    /**
     * Get the underlying IMAP client.
     */
    public function getClient(): Client
    {
        return $this->client;
    }
}