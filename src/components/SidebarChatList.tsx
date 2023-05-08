'use client';
import { FunctionComponent, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createChatHref } from '@/lib/utils/createChatHref';

interface ExtendedMessage extends Message {
    senderImg: string;
    senderName: string;
}

interface SidebarChatListProps {
    sessionId: string;
    friends: User[];
}

export const SidebarChatList: FunctionComponent<SidebarChatListProps> = ({ sessionId, friends }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
    const [activeChats, setActiveChats] = useState<User[]>(friends);

    useEffect(() => {
        if (pathname?.includes('chat')) {
            setUnseenMessages(prev => prev.filter(message => !pathname.includes(message.senderId)));
        }
    }, [pathname]);

    return (
        <ul role='list' className='-mx-2 max-h-[25rem] space-y-1 overflow-y-auto'>
            {activeChats.sort().map(friend => {
                const unseenMessagesCount = unseenMessages.filter(unseenMsg => unseenMsg.senderId === friend.id).length;
                return (
                    <li key={friend.id}>
                        <a
                            href={`/dashboard/chat/${createChatHref(sessionId, friend.id)}`}
                            className='group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'>
                            {friend.name}
                            {unseenMessagesCount > 0 ? (
                                <div className='flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white'>
                                    {unseenMessagesCount}
                                </div>
                            ) : null}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};
