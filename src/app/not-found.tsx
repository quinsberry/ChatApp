'use client';
import React, { FunctionComponent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';

interface NotFoundPageProps {}

const NotFoundPage: FunctionComponent<NotFoundPageProps> = props => {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <div className='flex h-[100vh] w-auto items-center justify-center'>
            <div className='flex flex-col gap-2'>
                <span className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                    {pathname?.startsWith('/dashboard/chat') ? 'Chat not found' : '404 Page Not Found'}
                </span>
                <Button onClick={() => router.back()}>Go back</Button>
            </div>
        </div>
    );
};
export default NotFoundPage;
