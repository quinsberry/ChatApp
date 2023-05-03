import { Redis } from '@upstash/redis';
import { z } from 'zod';

export const db = new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
});

export const getUserIdByEmail = (email: string): Promise<string | null> => {
    return db
        .get(`user:email:${email}`)
        .then(response => {
            if (!response) {
                return null;
            }
            return z.string().parse(response);
        })
        .catch(error => {
            console.error(`Error executing Redis command: ${error}`);
            return null;
        });
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

export const sendFriendRequest = (userIdToAdd: string, userId: string): Promise<void> => {
    return db
        .sadd(`user:${userIdToAdd}:incoming_friend_requests`, userId)
        .then(response => {
            z.union([z.literal(0), z.literal(1)]).parse(response);
            return;
        })
        .catch(error => {
            console.error(`Error executing Redis command: ${error}`);
        });
};
