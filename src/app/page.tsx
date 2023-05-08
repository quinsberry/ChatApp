'use client';
import { Button } from '@/components/common/Button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    router.replace('/dashboard');
    return (
        <div>
            <Button onClick={() => signOut()}>sign out</Button>
        </div>
    );
}
