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

export const MessageScheme = z.object(
    {
        id: z.string(),
        senderId: z.string(),
        text: z.string(),
        timestamp: z.number(),
    },
    { invalid_type_error: 'Invalid message type' }
);

export const ChatScheme = z.object(
    {
        id: z.string(),
        messages: MessageScheme.array(),
    },
    { invalid_type_error: 'Invalid chat type' }
);

export const FriendRequestScheme = z.object(
    {
        id: z.string(),
        senderId: z.string(),
        receiverId: z.string(),
    },
    { invalid_type_error: 'Invalid friendRequest type' }
);
