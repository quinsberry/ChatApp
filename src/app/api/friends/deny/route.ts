import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { removeUserFriendRequest } from '@/lib/redis/api';
import { z } from 'zod';
import { denyFriendRequestTrigger } from '@/lib/pusher/denyFriendRequest';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { id: idToDeny } = z.object({ id: z.string() }).parse(body);

        await removeUserFriendRequest(session.user.id, idToDeny);
        await denyFriendRequestTrigger(session.user.id);

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
