import { z } from 'zod';
import * as assert from 'assert';

export const isUser = (user: any): User => {
    return z
        .object(
            {
                id: z.string(),
                name: z.string(),
                email: z.string(),
                image: z.string(),
            },
            { invalid_type_error: 'Invalid user' }
        )
        .parse(user);
};
