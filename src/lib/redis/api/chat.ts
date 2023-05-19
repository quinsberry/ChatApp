import { redis } from '@/lib/redis';
import { MessageScheme } from '@/lib/redis/models/model-guards';
import { ZodError } from 'zod';

export const getLastMessagesFromChat = async (
    chatId: string,
    offset: number = 0,
    count: number = 0
): Promise<Message[]> => {
    try {
        const start = -offset - 1;
        const end = count === 0 ? 0 : start - count - 1;
        const response = await redis('zrange', `chat:${chatId}:messages`, end, start);
        return MessageScheme.array().parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected type of message array: ${error.issues}`);
        }
        throw new Error(`Error getting all messages from the chat: ${error}`);
    }
};
export const getLastMessageFromChat = async (chatId: string): Promise<Message> => {
    try {
        const response = await redis('zrange', `chat:${chatId}:messages`, -1, -1);
        const [lastMessage] = MessageScheme.array().parse(response);
        return MessageScheme.parse(lastMessage);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected type of message array: ${error.issues}`);
        }
        throw new Error(`Error getting all messages from the chat: ${error}`);
    }
};
export const sendMessageToChat = async (chatId: string, message: Message, timestamp: number): Promise<void> => {
    try {
        await redis('zadd', `chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message),
        });
    } catch (error) {
        throw new Error(`Error sending message: ${error}`);
    }
};
