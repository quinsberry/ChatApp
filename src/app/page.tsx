'use client';
import { Button } from '@/components/common/Button';
import { signOut } from 'next-auth/react';

export default function Home() {
    return (
        <div>
            <Button onClick={() => signOut()}>sign out</Button>
        </div>
    );
}
