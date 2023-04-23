import { z } from 'zod';

const envVariables = z.object({
    NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: z.string(),
    NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: z.string(),

    NEXTAUTH_URL: z.string(),
    NEXTAUTH_SECRET: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
});

const result = envVariables.safeParse(process.env);
if (!result.success) {
    const message = result.error.issues.reduce((acc, issue) => {
        acc = acc + `\n process.env.${issue.path[0]}`;
        return acc;
    }, '');
    throw new Error(`Missing env variables: ${message}`);
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envVariables> {}
    }
}
