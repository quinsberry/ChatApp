'use client';
import { Button } from '@/components/common/Button/Button';
import { getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { clientRedis, getUserById } from '@/lib/redis/client';

export default function Home() {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        getSession().then(session => {
            setSession(session);
        });
    }, []);
    const fetchData = () => {
        getUserById('dsdasd').then(res => console.log('getUserById', res));
    };
    return (
        <div>
            <div className='text-red-500'>hello world</div>
            <Button isInProgress={false} onClick={fetchData}>
                fetch redis
            </Button>
            {session && (
                <Button isInProgress={false} onClick={() => signOut()}>
                    sign out
                </Button>
            )}
        </div>
    );
}
