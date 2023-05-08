import { Redis } from '@upstash/redis';
import { serverRedis } from '@/lib/redis/server';
import { clientRedis } from '@/lib/redis/client';

export type RedisFunctionParams<T> = T extends (...args: infer U) => Promise<any> ? U : never;
export type ExcludeNonFunctionPropertyNames<T> = Pick<
    T,
    { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
>;
export const redis = <C extends keyof ExcludeNonFunctionPropertyNames<Redis>>(
    command: C,
    ...args: RedisFunctionParams<Redis[C]>
): Promise<unknown> => {
    return typeof window === 'undefined' ? serverRedis(command, ...args) : clientRedis(command, ...args);
};
