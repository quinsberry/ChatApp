import { assertType } from '@/lib/type-guards';
import { isUser } from '@/lib/db/model-guards';

type Command = 'zrange' | 'sismember' | 'get' | 'smembers';
export const fetchRedis = (command: Command, ...args: (string | number)[]): Promise<unknown> => {
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
    return fetchRedis('get', `user:${id}`).then(user => {
        if (!user) {
            return null;
        }
        assertType<User>(user, isUser);
        return user;
    });
};
