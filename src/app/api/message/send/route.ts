import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/auth';
import { getFriendIdsByUserId, getUserById, sendMessageToChat } from '@/lib/redis/api';
import { MessageScheme } from '@/lib/redis/models/model-guards';
import { parseChatHref } from '@/lib/utils/createChatHref';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, chatId } = z.object({ text: z.string(), chatId: z.string() }).parse(body);

        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }

        const [userId1, userId2] = parseChatHref(chatId);

        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response('Unauthorized', { status: 401 });
        }

        const friendId = session.user.id === userId1 ? userId2 : userId1;

        const friendList = await getFriendIdsByUserId(session.user.id);
        const isFriend = friendList.includes(friendId);

        if (!isFriend) {
            return new Response('Unauthorized', { status: 401 });
        }

        const sender = await getUserById(session.user.id);
        if (!sender) {
            return new Response('Unauthorized', { status: 401 });
        }

        const timestamp = Date.now();

        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp,
        };

        const message = MessageScheme.parse(messageData);

        await sendMessageToChat(chatId, message, timestamp);

        return new Response('OK');
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 });
        }
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }
        return new Response('Internal Server Error', { status: 500 });
    }
}
