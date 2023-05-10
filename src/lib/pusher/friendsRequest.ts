import { clientPusher, serverPusher, transformToPusherKey } from '@/lib/pusher/index';

const eventName = 'incoming_friend_requests';
const getFieldName = (userId: string) => `user:${userId}:incoming_friend_requests`;
export const friendsRequestSubscribe = (
    sessionId: string,
    handler: ({ senderId, senderEmail }: IncomingFriendRequest) => void
) => {
    clientPusher.subscribe(transformToPusherKey(getFieldName(sessionId)));
    const friendRequestHandler = ({ senderId, senderEmail }: IncomingFriendRequest) => {
        handler({ senderId, senderEmail });
    };
    clientPusher.bind(eventName, friendRequestHandler);
    return () => {
        clientPusher.unsubscribe(transformToPusherKey(getFieldName(sessionId)));
        clientPusher.unbind(eventName, friendRequestHandler);
    };
};

export const friendsRequestTrigger = async (
    userIdToAdd: string,
    senderId: string,
    senderEmail: string
): Promise<unknown> => {
    return serverPusher.trigger(transformToPusherKey(getFieldName(userIdToAdd)), eventName, {
        senderId,
        senderEmail,
    });
};
