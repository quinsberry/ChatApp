import { redis } from '@/lib/redis';
import { z, ZodError } from 'zod';
import { UserScheme } from '@/lib/redis/models/model-guards';

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
    try {
        const response = await redis('get', `user:email:${email}`);
        if (!response) {
            return null;
        }
        return z.string().parse(response);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(`Received unexpected type of user: ${error.issues}`);
        }
        throw new Error(`Error getting user by email: ${error}`);
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
            throw new Error(`Received unexpected type of user: ${error.issues}`);
        }
        throw new Error(`Error getting user by id: ${error}`);
    }
};
