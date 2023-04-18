import { z } from 'zod';

const envVariables = z.object({
    DB_API_KEY: z.string(),
    DB_AUTH_DOMAIN: z.string(),
    DB_PROJECT_ID: z.string(),
    DB_STORAGE_BUCKET: z.string(),
    DB_MESSAGING_SENDER_ID: z.string(),
    DB_APP_ID: z.string(),
    DB_MEASUREMENT_ID: z.string(),
    DB_DATABASE_ID: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
});
envVariables.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envVariables> {}
    }
}
