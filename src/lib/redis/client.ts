import { UserScheme } from '@/lib/redis/models/model-guards';
import { z, ZodError } from 'zod';
import { db } from '@/lib/redis/server';

type Command = 'zrange' | 'sismember' | 'get' | 'smembers';
export const clientRedis = (command: Command, ...args: (string | number)[]): Promise<unknown> => {
    const commandUrl = `${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/${command}/${args.join('/')}`;
    return fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: 'no-store',
    })
        .then(res => res.json())
        .then(res => {
            return typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
        })
        .catch(error => {
            console.error(`Error executing Redis command: ${error}`);
        });
};

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const response = await clientRedis('get', `user:${id}`);
        if (!response) {
            return null;
        }
        return UserScheme.parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
        return null;
    }
};

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
    try {
        const response = await clientRedis('get', `user:email:${email}`);
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

export const checkIfUserHasAFriendRequest = async (targetUserId: string, userId: string): Promise<boolean> => {
    try {
        const response = await clientRedis('sismember', `user:${targetUserId}:incoming_friend_requests`, userId);
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
        return false;
    }
};
export const checkIfUserIsFriend = async (targetUserId: string, userId: string): Promise<boolean> => {
    try {
        const response = await clientRedis('sismember', `user:${userId}:friends`, targetUserId);
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
        return false;
    }
};

export const getUserFriendRequestIds = async (userId: string): Promise<string[]> => {
    try {
        const response = await clientRedis('smembers', `user:${userId}:incoming_friend_requests`);
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
