<?php

namespace Justoverclock\NewsLetter\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Justoverclock\NewsLetter\Jobs\EmailSender;
use Justoverclock\NewsLetter\Serializer\NewsLetterSubscriberSerializer;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Tobscure\JsonApi\Document;

class SendEmailController extends AbstractCreateController
{

    public $serializer = NewsLetterSubscriberSerializer::class;
    public function __construct(protected Dispatcher $bus)
    {
    }


    protected function data(ServerRequestInterface $request, Document $document)
    {
        $data = $request->getParsedBody();

        $subject = Arr::get($data, 'subject');
        $body = Arr::get($data, 'body');
        $html = Arr::get($data, 'html', false);

        if (!$subject || !$body) {
            return new BadRequestException('Missing required fields');
        }

        $this->bus->dispatch(
            new EmailSender('', $subject, $body, $html)
        );

        return true;
    }
}
