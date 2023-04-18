import { NextAuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { dbAdapter } from '@/lib/db/db';
import { getUserById } from '@/lib/api/api';


export const authOptions: NextAuthOptions = {
    adapter: dbAdapter,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            const dbUser = await getUserById(user.id);
            if (!dbUser) {
                token.id = user.id;
                return token;
            }
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            };
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
        redirect({ url, baseUrl }) {
            return '/dashboard';
        },
    },
};
