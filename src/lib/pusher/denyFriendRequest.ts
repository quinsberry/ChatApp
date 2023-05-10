import { clientPusher, serverPusher, transformToPusherKey } from '@/lib/pusher/index';

const eventName = 'deny_friend_request';
const getFieldName = (userId: string) => `user:${userId}:deny_friend_request`;
export const denyFriendRequestSubscribe = (sessionId: string, handler: () => void) => {
    clientPusher.subscribe(transformToPusherKey(getFieldName(sessionId)));
    const friendRequestHandler = () => {
        handler();
    };
    clientPusher.bind(eventName, friendRequestHandler);
    return () => {
        clientPusher.unsubscribe(transformToPusherKey(getFieldName(sessionId)));
        clientPusher.unbind(eventName, friendRequestHandler);
    };
};

export const denyFriendRequestTrigger = async (userId: string): Promise<unknown> => {
    return serverPusher.trigger(transformToPusherKey(getFieldName(userId)), eventName, null);
};
