'use client';
import { FunctionComponent, useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { incomingMessageSubscribe } from '@/lib/pusher/incomingMessage';
import { useInfiniteScroll } from '@/lib/utils/useInfiniteScroll';
import { getLastMessagesFromChat } from '@/lib/redis/api';
import { Loader2 } from 'lucide-react';

const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
};

interface MessagesProps {
    initialMessages: Message[];
    sessionId: string;
    chatId: string;
    sessionImg: string | null | undefined;
    chatPartner: User;
}

export const DEFAULT_MESSAGES_SIZE = 50;

export const Messages: FunctionComponent<MessagesProps> = ({
    initialMessages,
    sessionId,
    chatId,
    chatPartner,
    sessionImg,
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [lastMessageFetched, setLastMessageFetched] = useState(initialMessages.length < DEFAULT_MESSAGES_SIZE);

    const ref = useInfiniteScroll({
        callback: async () => {
            const receivedMessages = await getLastMessagesFromChat(chatId, messages.length, DEFAULT_MESSAGES_SIZE);
            if (receivedMessages.length < DEFAULT_MESSAGES_SIZE) {
                setLastMessageFetched(true);
            }
            const orderedMessages = receivedMessages.reverse();
            setMessages(prev => [...prev, ...orderedMessages]);
        },
        trigger: messages.length,
        direction: 'from-bottom-to-top',
    });

    useEffect(() => {
        const unsubscribe = incomingMessageSubscribe(chatId, message => setMessages(prev => [message, ...prev]));
        return unsubscribe;
    }, [chatId]);

    return (
        <div
            id='messages'
            ref={ref}
            className={cn(
                'scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3',
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
                                        <span className='ml-2 text-xs text-gray-500'>
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
            {!lastMessageFetched && (
                <div className='flex w-full justify-center'>
                    <Loader2 className='animate-spin' />
                </div>
            )}
        </div>
    );
};
