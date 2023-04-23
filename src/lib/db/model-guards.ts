import { z } from 'zod';

export const isUser = (user: any): user is User => {
    return z
        .object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            image: z.string(),
        })
        .safeParse(user).success;
};
