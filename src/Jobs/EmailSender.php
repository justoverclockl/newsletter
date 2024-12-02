<?php

namespace Justoverclock\NewsLetter\Jobs;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Justoverclock\NewsLetter\Models\NewsLetterSubscriber;

class EmailSender implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $email,
        protected string $subject,
        protected string $body,
        protected bool   $html = false,

    )
    {

    }

    public function handle(SettingsRepositoryInterface $settings, Mailer $mailer, ViewFactory $view): void
    {
        // TODO: add more variables such cta text, cta url or similar to make it customizable
        $htmlContent = $view->make('justoverclock-newsletter::email.newsletter', [
            'body' => $this->body,
            'subject' => $this->subject
        ])->render();

        NewsLetterSubscriber::chunk(50, function ($subscribers) use ($mailer, $htmlContent, $settings) {
            foreach ($subscribers as $subscriber) {
                $mailer->send([], [], function (Message $message) use ($settings, $subscriber, $htmlContent) {
                    $message->setBody($htmlContent, 'text/html');
                    $message->to($subscriber->email);
                    $message->subject('[' . $settings->get('forum_title') . '] ' . $this->subject);
                });
            }
        });
    }
}
