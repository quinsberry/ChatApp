import { clientPusher, serverPusher, transformToPusherKey } from '@/lib/pusher/index';

interface ExtendedMessage extends Message {
    senderName: string;
    senderImg: string;
}

const eventName = 'new_message';
const getFieldName = (sessionId: string) => `user:${sessionId}:chats`;
export const newMessageSubscribe = (sessionId: string, handler: (message: ExtendedMessage) => void) => {
    clientPusher.subscribe(transformToPusherKey(getFieldName(sessionId)));
    const chatHandler = (message: ExtendedMessage) => {
        handler(message);
    };
    clientPusher.bind(eventName, chatHandler);
    return () => {
        clientPusher.unsubscribe(transformToPusherKey(getFieldName(sessionId)));
        clientPusher.unbind(eventName, chatHandler);
    };
};

export const newMessageTrigger = async (userId: string, message: ExtendedMessage): Promise<unknown> => {
    return serverPusher.trigger(transformToPusherKey(getFieldName(userId)), eventName, message);
};
