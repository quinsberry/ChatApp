import { z } from 'zod';

export const UserScheme = z.object(
    {
        id: z.string(),
        name: z.string(),
        email: z.string(),
        image: z.string(),
    },
    { invalid_type_error: 'Invalid user type' }
);
