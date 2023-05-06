'use client';
import React, { Fragment, FunctionComponent, useState } from 'react';
import { Check, UserPlus, X } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface FriendRequestsProps {
    sessionId: string;
    incomingFriendsRequests: IncomingFriendRequest[];
}

export const FriendRequests: FunctionComponent<FriendRequestsProps> = ({ sessionId, incomingFriendsRequests }) => {
    const router = useRouter();
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendsRequests);

    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', { id: senderId });
        setFriendRequests(prev => prev.filter(request => request.senderId !== senderId));
        router.refresh();
    };

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', { id: senderId });
        setFriendRequests(prev => prev.filter(request => request.senderId !== senderId));
        router.refresh();
    };
    return (
        <Fragment>
            {friendRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here...</p>
            ) : (
                friendRequests.map(request => (
                    <div key={request.senderId} className='flex items-center gap-4'>
                        <UserPlus className='text-black' />
                        <p className='text-lg font-medium'>{request.senderEmail}</p>
                        <button
                            onClick={() => acceptFriend(request.senderId)}
                            aria-label='accept friend'
                            className='grid h-8 w-8 place-items-center rounded-full bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md'>
                            <Check className='h-3/4 w-3/4 font-semibold text-white' />
                        </button>

                        <button
                            onClick={() => denyFriend(request.senderId)}
                            aria-label='deny friend'
                            className='grid h-8 w-8 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md'>
                            <X className='h-3/4 w-3/4 font-semibold text-white' />
                        </button>
                    </div>
                ))
            )}
        </Fragment>
    );
};
