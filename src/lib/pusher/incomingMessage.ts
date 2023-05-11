import { clientPusher, serverPusher, transformToPusherKey } from '@/lib/pusher/index';

const eventName = 'incoming_message';
const getFieldName = (chatId: string) => `chat:${chatId}`;
export const incomingMessageSubscribe = (chatId: string, handler: (message: Message) => void) => {
    clientPusher.subscribe(transformToPusherKey(getFieldName(chatId)));
    const addFriendHandler = (message: Message) => {
        handler(message);
    };
    clientPusher.bind(eventName, addFriendHandler);
    return () => {
        clientPusher.unsubscribe(transformToPusherKey(getFieldName(chatId)));
        clientPusher.unbind(eventName, addFriendHandler);
    };
};

export const incomingMessageTrigger = async (chatId: string, message: Message): Promise<unknown> => {
    return serverPusher.trigger(transformToPusherKey(getFieldName(chatId)), eventName, message);
};
