import { Redis } from '@upstash/redis';
import { ExcludeNonFunctionPropertyNames, RedisFunctionParams } from '@/lib/redis';

export const clientRedis = async <C extends keyof ExcludeNonFunctionPropertyNames<Redis>>(
    command: C,
    ...args: RedisFunctionParams<Redis[C]>
): Promise<unknown> => {
    const commandUrl = `${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}/${command}/${args.join('/')}`;
    try {
        const response = await fetch(commandUrl, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}`,
            },
        });
        const json = await response.json();
        try {
            return JSON.parse(json.result);
        } catch {
            return json.result;
        }
    } catch (error) {
        console.error(`Error executing Redis command on client: ${error}`);
        return Promise.reject(new Error(`Error executing Redis command on client: ${error}`));
    }
};
