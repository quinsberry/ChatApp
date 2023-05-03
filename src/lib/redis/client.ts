import { isUser } from '@/lib/redis/models/model-guards';
import { z } from 'zod';

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

export const getUserById = (id: string): Promise<User | null> => {
    return clientRedis('get', `user:${id}`).then(response => {
        if (!response) {
            return null;
        }
        return isUser(response);
    });
};

export const getUserIdByEmail = (email: string): Promise<string | null> => {
    return clientRedis('get', `user:email:${email}`).then(response => {
        if (!response) {
            return null;
        }
        return z.string().parse(response);
    });
};

export const checkIfUserHasAFriendRequest = (targetUserId: string, userId: string): Promise<boolean> => {
    return clientRedis('sismember', `user:${targetUserId}:incoming_friend_requests`, userId).then(response => {
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    });
};
export const checkIfUserIsFriend = (targetUserId: string, userId: string): Promise<boolean> => {
    return clientRedis('sismember', `user:${userId}:friends`, targetUserId).then(response => {
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    });
};
