import { clientPusher, serverPusher, transformToPusherKey } from '@/lib/pusher/index';

const eventName = 'new_friend';
const getFieldName = (userId: string) => `user:${userId}:friends`;
export const addFriendSubscribe = (sessionId: string, handler: (newFriend: User) => void) => {
    clientPusher.subscribe(transformToPusherKey(getFieldName(sessionId)));
    const addFriendHandler = (newFriend: User) => {
        handler(newFriend);
    };
    clientPusher.bind(eventName, addFriendHandler);
    return () => {
        clientPusher.unsubscribe(transformToPusherKey(getFieldName(sessionId)));
        clientPusher.unbind(eventName, addFriendHandler);
    };
};

export const addFriendTrigger = async (userId: string, user: User): Promise<unknown> => {
    return serverPusher.trigger(transformToPusherKey(getFieldName(userId)), eventName, user);
};
