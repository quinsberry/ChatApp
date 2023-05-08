import { Redis } from '@upstash/redis';
import { ExcludeNonFunctionPropertyNames, RedisFunctionParams } from '@/lib/redis/index';

export const db = new Redis({
    url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
});

export const serverRedis = async <C extends keyof ExcludeNonFunctionPropertyNames<Redis>>(
    command: C,
    ...args: RedisFunctionParams<Redis[C]>
): Promise<unknown> => {
    try {
        //@ts-ignore typescript problems with union type, but it works because command and args are well typed.
        return db[command](...args);
    } catch (error) {
        console.error(`Error executing Redis command on server: ${error}`);
        return Promise.reject(new Error(`Error executing Redis command on server: ${error}`));
    }
};
