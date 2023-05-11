'use client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { incomingMessageSubscribe } from '@/lib/pusher/incomingMessage';

interface MessagesProps {
    initialMessages: Message[];
    sessionId: string;
    chatId: string;
    sessionImg: string | null | undefined;
    chatPartner: User;
}

export const Messages: FunctionComponent<MessagesProps> = ({
    initialMessages,
    sessionId,
    chatId,
    chatPartner,
    sessionImg,
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    useEffect(() => {
        const unsubscribe = incomingMessageSubscribe(chatId, message => setMessages(prev => [message, ...prev]));
        return unsubscribe;
    }, [chatId]);

    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm');
    };

    return (
        <div
            id='messages'
            className={cn(
                'scrollbar-thumb-gray scrollbar-thumb-rounded scrollbar-track-gray-lighter scrollbar-w-4 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3',
                {
                    'flex-col items-center justify-center': messages.length === 0,
                }
            )}>
            {messages.length === 0 ? (
                <span className='text-sm text-gray-500'>No messages here yet</span>
            ) : (
                messages.map((message, index) => {
                    const isCurrentUser = message.senderId === sessionId;
                    const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId;
                    return (
                        <div className='chat-message' key={`${message.id}-${message.timestamp}`}>
                            <div
                                className={cn('flex items-end', {
                                    'justify-end': isCurrentUser,
                                })}>
                                <div
                                    className={cn('mx-2 flex max-w-xs flex-col space-y-2 text-base', {
                                        'order-1 items-end': isCurrentUser,
                                        'order-2 items-start': !isCurrentUser,
                                    })}>
                                    <span
                                        className={cn('inline-block rounded-lg px-4 py-2', {
                                            'bg-indigo-600 text-white': isCurrentUser,
                                            'bg-gray-200 text-gray-900': !isCurrentUser,
                                            'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                            'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,
                                        })}>
                                        {message.text}{' '}
                                        <span className='ml-2 text-xs text-gray-400'>
                                            {formatTimestamp(message.timestamp)}
                                        </span>
                                    </span>
                                </div>

                                <div
                                    className={cn('relative h-6 w-6', {
                                        'order-2': isCurrentUser,
                                        'order-1': !isCurrentUser,
                                        invisible: hasNextMessageFromSameUser,
                                    })}>
                                    <Image
                                        fill
                                        src={isCurrentUser ? String(sessionImg) : chatPartner.image}
                                        alt='Profile picture'
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};
