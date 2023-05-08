import React, { FunctionComponent } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';
import { getUserById, getUserFriendRequestIds } from '@/lib/redis/api';
import { FriendRequests } from '@/components/FriendRequests';

const page = async ({}) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        notFound();
    }
    const userFriendRequestIds = await getUserFriendRequestIds(session.user.id);

    const userFriendRequests = await Promise.all(userFriendRequestIds.map(getUserById));
    const incomingFriendsRequests: IncomingFriendRequest[] = userFriendRequests.reduce((acc, user) => {
        if (user) {
            acc.push({
                senderId: user.id,
                senderEmail: user.email,
            });
        }
        return acc;
    }, [] as IncomingFriendRequest[]);
    return (
        <main className='pt-8'>
            <h1 className='mb-8 text-5xl font-bold'>Friend requests</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests sessionId={session.user.id} incomingFriendsRequests={incomingFriendsRequests} />
            </div>
        </main>
    );
};

export default page;
