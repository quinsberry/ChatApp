import { clientPusher, serverPusher, transformToPusherKey } from '@/lib/pusher/index';

const eventName = 'remove_friend_request';
const getFieldName = (userId: string) => `user:${userId}:remove_friend_request`;
export const removeFriendRequestSubscribe = (sessionId: string, handler: (senderId: string) => void) => {
    clientPusher.subscribe(transformToPusherKey(getFieldName(sessionId)));
    const friendRequestHandler = (senderId: string) => {
        handler(senderId);
    };
    clientPusher.bind(eventName, friendRequestHandler);
    return () => {
        clientPusher.unsubscribe(transformToPusherKey(getFieldName(sessionId)));
        clientPusher.unbind(eventName, friendRequestHandler);
    };
};

export const removeFriendRequestTrigger = async (userId: string, senderId: string): Promise<unknown> => {
    return serverPusher.trigger(transformToPusherKey(getFieldName(userId)), eventName, senderId);
};
