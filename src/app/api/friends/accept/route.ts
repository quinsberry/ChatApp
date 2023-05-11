import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import {
    addUserToFriendsList,
    checkIfUserHasAFriendRequest,
    checkIfUserIsFriend,
    getUserById,
    removeUserFriendRequest,
} from '@/lib/redis/api';
import { addFriendTrigger } from '@/lib/pusher/addFriend';
import { UserScheme } from '@/lib/redis/models/model-guards';
import { removeFriendRequestTrigger } from '@/lib/pusher/removeSendRequest';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { id: userIdToAdd } = z.object({ id: z.string() }).parse(body);

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }

        // verify both users are not already friends
        const isAlreadyFriend = await checkIfUserIsFriend(userIdToAdd, session.user.id);

        if (isAlreadyFriend) {
            // if users are already friends but request is still exists, remove it.
            await removeUserFriendRequest(session.user.id, userIdToAdd);
            const friend = await getUserById(userIdToAdd);
            const parsedFriend = UserScheme.parse(friend);
            await addFriendTrigger(session.user.id, parsedFriend);
            return new Response('OK');
        }

        // check if user has already added
        const hasFriendRequest = await checkIfUserHasAFriendRequest(session.user.id, userIdToAdd);

        if (!hasFriendRequest) {
            return new Response('No friend request found', { status: 400 });
        }

        const [user, friend] = await Promise.all([getUserById(session.user.id), getUserById(userIdToAdd)]);
        const parsedUser = UserScheme.parse(user);
        const parsedFriend = UserScheme.parse(friend);

        await Promise.all([
            addUserToFriendsList(session.user.id, userIdToAdd),
            addUserToFriendsList(userIdToAdd, session.user.id),
            removeUserFriendRequest(session.user.id, userIdToAdd),
            addFriendTrigger(userIdToAdd, parsedUser),
            addFriendTrigger(session.user.id, parsedFriend),
        ]);

        const hasFriendMyFriendRequest = await checkIfUserHasAFriendRequest(userIdToAdd, session.user.id);
        if (hasFriendMyFriendRequest) {
            await Promise.all([
                removeUserFriendRequest(userIdToAdd, session.user.id),
                removeFriendRequestTrigger(userIdToAdd, session.user.id),
            ]);
        }

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
