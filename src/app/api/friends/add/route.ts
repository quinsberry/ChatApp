import { addFriendValidator } from '@/lib/validators/addFriendValidator';
import {
    getUserIdByEmail,
    sendFriendRequest,
    checkIfUserHasAFriendRequest,
    checkIfUserIsFriend,
} from '@/lib/redis/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { z } from 'zod';
import { friendsRequestTrigger } from '@/lib/pusher/friendsRequest';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email: emailToAdd } = addFriendValidator.parse(body);
        const userIdToAdd = await getUserIdByEmail(emailToAdd);

        if (!userIdToAdd) {
            return new Response('This person does not exist.', { status: 400 });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }

        if (userIdToAdd === session.user.id) {
            return new Response('You cannot add yourself as a friend', { status: 400 });
        }

        // check if user has already added
        const isAlreadyAdded = await checkIfUserHasAFriendRequest(userIdToAdd, session.user.id);

        if (isAlreadyAdded) {
            return new Response('You have already sent a request for this user', { status: 400 });
        }

        // check if user is already friend
        const isAlreadyFriend = await checkIfUserIsFriend(userIdToAdd, session.user.id);

        if (isAlreadyFriend) {
            return new Response('Already friends with this user', { status: 400 });
        }

        await sendFriendRequest(userIdToAdd, session.user.id);
        const sessionEmail = z.string().parse(session.user.email);
        await friendsRequestTrigger(userIdToAdd, session.user.id, sessionEmail);

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
