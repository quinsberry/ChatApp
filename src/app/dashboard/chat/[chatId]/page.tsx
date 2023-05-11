import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';
import { getAllMessagesFromChat, getUserById } from '@/lib/redis/api';
import Image from 'next/image';
import { Messages } from '@/components/Messages';
import { ChatInput } from '@/components/ChatInput';
import type { Metadata } from 'next';
import { parseChatHref } from '@/lib/utils/createChatHref';

export async function generateMetadata({ params }: { params: { chatId: string } }): Promise<Metadata> {
    const session = await getServerSession(authOptions);
    const [userId1, userId2] = parseChatHref(params.chatId);
    const defaultMetadata = { title: 'ChatApp | Chat' };
    if (!session) {
        return defaultMetadata;
    }
    const { user } = session;

    const chatPartnerId = user.id === userId1 ? userId2 : userId1;
    const chatPartner = await getUserById(chatPartnerId);
    if (!chatPartner) {
        return defaultMetadata;
    }

    return { title: `ChatApp | ${chatPartner.name}` };
}

interface PageProps {
    params: {
        chatId: string;
    };
}
const page = async ({ params }: PageProps) => {
    const { chatId } = params;
    const session = await getServerSession(authOptions);
    if (!session) {
        notFound();
    }
    const { user } = session;

    const [userId1, userId2] = parseChatHref(chatId);

    if (user.id !== userId1 && user.id !== userId2) {
        notFound();
    }
    const chatPartnerId = user.id === userId1 ? userId2 : userId1;
    const chatPartner = await getUserById(chatPartnerId);
    if (chatPartner === null) {
        notFound();
    }
    const initialMessages = (await getAllMessagesFromChat(chatId)).reverse();
    return (
        <div className='flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between'>
            <div className='flex justify-between border-b-2 border-gray-200 py-3 sm:items-center'>
                <div className='relative flex items-center space-x-4'>
                    <div className='relative'>
                        <div className='relative h-8 w-8 sm:h-12 sm:w-12'>
                            <Image
                                fill={true}
                                referrerPolicy='no-referrer'
                                src={chatPartner.image}
                                alt={`${chatPartner.name} profile picture`}
                                className='rounded-full'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col leading-tight'>
                        <div className='flex items-center text-xl'>
                            <span className='mr-3 font-semibold text-gray-700'>{chatPartner.name}</span>
                        </div>

                        <span className='text-sm text-gray-600'>{chatPartner.email}</span>
                    </div>
                </div>
            </div>

            <Messages
                chatId={chatId}
                chatPartner={chatPartner}
                sessionImg={session.user.image}
                sessionId={session.user.id}
                initialMessages={initialMessages}
            />
            <ChatInput chatId={chatId} chatPartner={chatPartner} />
        </div>
    );
};

export default page;
