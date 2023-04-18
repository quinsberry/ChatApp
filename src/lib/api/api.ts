import { DB } from '@/lib/db/basic-operations';
import { assertType } from '@/lib/type-guards';
import { isUser } from '@/types/db-model-guards';

const isOptionallyUser = (user: unknown): boolean => isUser(user) || user === null;
export const getUserById = (id: string): Promise<User | null> => {
    return DB.read(`users/${id}`).then(response => {
        assertType<User | null>(response, isOptionallyUser, 'Unexpected type of user');
        return response;
    });
};
