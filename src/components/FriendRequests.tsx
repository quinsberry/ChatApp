'use client';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { Check, UserPlus, X } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { friendsRequestSubscribe } from '@/lib/pusher/friendsRequest';
import { removeFriendRequestSubscribe } from '@/lib/pusher/removeSendRequest';

interface FriendRequestsProps {
    sessionId: string;
    incomingFriendsRequests: IncomingFriendRequest[];
}

export const FriendRequests: FunctionComponent<FriendRequestsProps> = ({ sessionId, incomingFriendsRequests }) => {
    const router = useRouter();
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendsRequests);

    useEffect(() => {
        const unsubscribe1 = friendsRequestSubscribe(sessionId, ({ senderId, senderEmail }) =>
            setFriendRequests(prev => [...prev, { senderId, senderEmail }])
        );
        const unsubscribe2 = removeFriendRequestSubscribe(sessionId, senderId => {
            setFriendRequests(prev => prev.filter(request => request.senderId !== senderId));
        });
        return () => {
            unsubscribe1();
            unsubscribe2();
        };
    }, [sessionId]);

    const acceptFriend = async (senderId: string) => {
        setIsSendingRequest(true);
        await axios.post('/api/friends/accept', { id: senderId });
        setIsSendingRequest(false);
        setFriendRequests(prev => prev.filter(request => request.senderId !== senderId));
        router.refresh();
    };

    const denyFriend = async (senderId: string) => {
        setIsSendingRequest(true);
        await axios.post('/api/friends/deny', { id: senderId });
        setIsSendingRequest(false);
        setFriendRequests(prev => prev.filter(request => request.senderId !== senderId));
        router.refresh();
    };
    return (
        <Fragment>
            {friendRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>No new requests</p>
            ) : (
                friendRequests.map(request => (
                    <div key={request.senderId} className='flex items-center gap-4'>
                        <UserPlus className='text-black' />
                        <p className='text-lg font-medium'>{request.senderEmail}</p>
                        <button
                            onClick={() => acceptFriend(request.senderId)}
                            disabled={isSendingRequest}
                            aria-label='accept friend'
                            className='grid h-8 w-8 place-items-center rounded-full bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md'>
                            <Check className='h-3/4 w-3/4 font-semibold text-white' />
                        </button>

                        <button
                            onClick={() => denyFriend(request.senderId)}
                            disabled={isSendingRequest}
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
