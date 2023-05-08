import { redis } from '@/lib/redis';
import { z, ZodError } from 'zod';
import { UserScheme } from '@/lib/redis/models/model-guards';

export const checkIfUserHasAFriendRequest = async (targetUserId: string, userId: string): Promise<boolean> => {
    try {
        const response = await redis('sismember', `user:${targetUserId}:incoming_friend_requests`, userId);
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected types: ${error.issues}`);
        }
        throw new Error(`Error checking if user has a friend request: ${error}`);
    }
};

export const checkIfUserIsFriend = async (targetUserId: string, userId: string): Promise<boolean> => {
    try {
        const response = await redis('sismember', `user:${userId}:friends`, targetUserId);
        const boolean = z.union([z.literal(0), z.literal(1)]).parse(response);
        return Boolean(boolean);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected types: ${error.issues}`);
        }
        throw new Error(`Error checking if user is a friends: ${error}`);
    }
};

export const sendFriendRequest = async (userIdToAdd: string, userId: string): Promise<void> => {
    try {
        const response = await redis('sadd', `user:${userIdToAdd}:incoming_friend_requests`, userId);
        z.union([z.literal(0), z.literal(1)]).parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected types: ${error.issues}`);
        }
        throw new Error(`Error sending friend request: ${error}`);
    }
};

export const getUserFriendRequestIds = async (userId: string): Promise<string[]> => {
    try {
        const response = await redis('smembers', `user:${userId}:incoming_friend_requests`);
        return z.string().array().parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected type of friend requests: ${error.issues}`);
        }
        throw new Error(`Error getting friend request ids: ${error}`);
    }
};

export const addUserToFriendsList = async (userId: string, userIdToAdd: string): Promise<void> => {
    try {
        const response = await redis('sadd', `user:${userId}:friends`, userIdToAdd);
        z.union([z.literal(0), z.literal(1)]).parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected types: ${error.issues}`);
        }
        throw new Error(`Error adding user to the friend list: ${error}`);
    }
};

export const removeUserFriendRequest = async (userId: string, userIdToRemoveRequest: string): Promise<void> => {
    try {
        const response = await redis('srem', `user:${userId}:incoming_friend_requests`, userIdToRemoveRequest);
        z.union([z.literal(0), z.literal(1)]).parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected types: ${error.issues}`);
        }
        throw new Error(`Error removing a friend request: ${error}`);
    }
};

export const getFriendIdsByUserId = async (userId: string): Promise<string[]> => {
    try {
        const response = await redis('smembers', `user:${userId}:friends`);
        return z.string().array().parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected type of friend id: ${error.issues}`);
        }
        throw new Error(`Error getting friend ids by user id: ${error}`);
    }
};

export const getFriendByUserId = async (userId: string): Promise<User | null> => {
    try {
        const response = await redis('get', `user:${userId}`);
        if (response === null) {
            return null;
        }
        return UserScheme.parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected type of friend: ${error.issues}`);
        }
        throw new Error(`Error getting a friend from user: ${error}`);
    }
};

export const getFriendsByUserId = async (userId: string): Promise<User[]> => {
    try {
        const friendIds = await getFriendIdsByUserId(userId);
        const friends = (await Promise.all(friendIds.map(getFriendByUserId))).filter(friend => friend !== null);
        return UserScheme.array().parse(friends);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected type of friends: ${error.issues}`);
        }
        throw new Error(`Error getting friends from user: ${error}`);
    }
};
