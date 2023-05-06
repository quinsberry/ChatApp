import { Redis } from '@upstash/redis';
import { serverRedis } from '@/lib/redis/server';
import { clientRedis } from '@/lib/redis/client';

export type RedisFunctionParams<T> = T extends (...args: infer U) => Promise<any> ? U : never;
export const redis = <C extends keyof Redis>(command: C, ...args: RedisFunctionParams<Redis[C]>): Promise<unknown> => {
    return typeof window === 'undefined' ? serverRedis(command, ...args) : clientRedis(command, ...args);
};
