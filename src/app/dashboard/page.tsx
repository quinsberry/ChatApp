import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';
import { getFriendsByUserId, getLastMessageFromChat } from '@/lib/redis/api';
import { createChatHref } from '@/lib/utils/createChatHref';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const DashboardPage: () => Promise<JSX.Element> = async () => {
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const friends = await getFriendsByUserId(session.user.id);

    const friendsWithLastMessage = await Promise.all(
        friends.map(async friend => {
            const chatId = createChatHref(session.user.id, friend.id);
            const lastMessage = await getLastMessageFromChat(chatId);
            return {
                ...friend,
                lastMessage,
            };
        })
    );
    return (
        <div className='container py-12'>
            <h1 className='mb-8 text-5xl font-bold'>Recent chats</h1>
            {friendsWithLastMessage.length === 0 ? (
                <p className='text-sm text-zinc-500'>No recent chats</p>
            ) : (
                friendsWithLastMessage.map(friend => (
                    <div key={friend.id} className='rounded-md border border-zinc-200 bg-zinc-50 p-3'>
                        <Link
                            href={`/dashboard/chat/${createChatHref(session.user.id, friend.id)}`}
                            className='sm:flex'>
                            <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                                <div className='relative h-6 w-6'>
                                    <Image
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        alt={`${friend.name} profile picture`}
                                        src={friend.image}
                                        fill={true}
                                    />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <h4 className='text-lg font-semibold'>{friend.name}</h4>
                                <p className='mt-1 max-w-md line-clamp-2'>
                                    <span className='text-zinc-400'>
                                        {friend.lastMessage.senderId === session.user.id ? 'You: ' : ''}
                                    </span>
                                    {friend.lastMessage.text}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                <ChevronRight className='h-7 w-7 text-zinc-400' />
                            </div>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default DashboardPage;
