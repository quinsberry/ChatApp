import { z, ZodError } from 'zod';
import { UserScheme } from '@/lib/redis/models/model-guards';
import { redis } from '@/lib/redis/index';

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
    try {
        const response = await redis('get', `user:email:${email}`);
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

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const response = await redis('get', `user:${id}`);
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

export const checkIfUserHasAFriendRequest = (targetUserId: string, userId: string): Promise<boolean> => {
    return redis('sismember', `user:${targetUserId}:incoming_friend_requests`, userId).then(response => {
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    });
};
export const checkIfUserIsFriend = (targetUserId: string, userId: string): Promise<boolean> => {
    return redis('sismember', `user:${userId}:friends`, targetUserId).then(response => {
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    });
};

export const sendFriendRequest = async (userIdToAdd: string, userId: string): Promise<void> => {
    try {
        const response = await redis('sadd', `user:${userIdToAdd}:incoming_friend_requests`, userId);
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
        const response = await redis('smembers', `user:${userId}:incoming_friend_requests`);
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

export const addUserToFriendsList = async (userId: string, userIdToAdd: string): Promise<void> => {
    try {
        const response = await redis('sadd', `user:${userId}:friends`, userIdToAdd);
        z.union([z.literal(0), z.literal(1)]).parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
    }
};

export const removeUserFriendRequest = async (userId: string, userIdToRemoveRequest: string): Promise<void> => {
    try {
        const response = await redis('srem', `user:${userId}:incoming_friend_requests`, userIdToRemoveRequest);
        z.union([z.literal(0), z.literal(1)]).parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error('Received unexpected types', error.issues);
        } else {
            console.error(`Error executing Redis command: ${error}`);
        }
    }
};
