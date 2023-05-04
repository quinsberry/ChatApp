import { Redis } from '@upstash/redis';
import { z, ZodError } from 'zod';
import { UserScheme } from '@/lib/redis/models/model-guards';

export const db = new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
});

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
    try {
        const response = await db.get(`user:email:${email}`);
        if (!response) {
            return null;
        }
        return z.string().parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
        return null;
    }
};

export const checkIfUserHasAFriendRequest = (targetUserId: string, userId: string): Promise<boolean> => {
    return db.sismember(`user:${targetUserId}:incoming_friend_requests`, userId).then(response => {
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    });
};
export const checkIfUserIsFriend = (targetUserId: string, userId: string): Promise<boolean> => {
    return db.sismember(`user:${userId}:friends`, targetUserId).then(response => {
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    });
};

export const sendFriendRequest = async (userIdToAdd: string, userId: string): Promise<void> => {
    try {
        const response = await db.sadd(`user:${userIdToAdd}:incoming_friend_requests`, userId);
        z.union([z.literal(0), z.literal(1)]).parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
    }
};

export const getUserFriendRequestIds = async (userId: string): Promise<string[]> => {
    try {
        const response = await db.smembers(`user:${userId}:incoming_friend_requests`);
        return z.string().array().parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
        return [];
    }
};
