import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/common/icons/Logo';
import { SignOutButton } from '@/components/SignOutButton';
import { FriendRequestsSidebarOption } from '@/components/FriendRequestsSidebarOption';
import { getFriendsByUserId, getUserFriendRequestIds } from '@/lib/redis/api';
import { SidebarChatList } from '@/components/SidebarChatList';
import { MobileChatLayout } from '@/components/MobileChatLayout';
import { DashboardIcon, DashboardIcons } from '@/components/DashboardIcons';

interface LayoutProps {
    children: ReactNode;
}
export interface SidebarOption {
    id: number;
    name: string;
    href: string;
    Icon: DashboardIcon;
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    },
];

export const metadata = {
    title: 'ChatApp | Dashboard',
    description: 'Your dashboard',
};

const Layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        notFound();
    }
    const friends = await getFriendsByUserId(session.user.id);
    const unseenRequestCount = (await getUserFriendRequestIds(session.user.id)).length;
    return (
        <div className='flex h-screen w-full'>
            <div className='md:hidden'>
                <MobileChatLayout
                    friends={friends}
                    session={session}
                    sidebarOptions={sidebarOptions}
                    unseenRequestCount={unseenRequestCount}
                />
            </div>
            <aside className='hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:flex'>
                <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                    <Logo className='h-8 w-auto' />
                </Link>
                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li>
                            <SidebarChatList sessionId={session.user.id} friends={friends} />
                        </li>
                        <li>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>Overview</div>
                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sidebarOptions.map(option => {
                                    const Icon = DashboardIcons[option.Icon];
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className='group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'>
                                                <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
                                                    <Icon className='h-4 w-4' />
                                                </span>

                                                <span className='truncate'>{option.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li>
                                    <FriendRequestsSidebarOption
                                        sessionId={session.user.id}
                                        initUnseenRequestCount={unseenRequestCount}
                                    />
                                </li>
                            </ul>
                        </li>
                        <li className='-mx-6 mt-auto flex items-center'>
                            <div className='flex w-full flex-1 items-center justify-between px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative mr-2 h-8 w-8 shrink-0 bg-gray-50'>
                                    <Image
                                        fill={true}
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image ?? ''}
                                        alt='Your profile picture'
                                    />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col overflow-hidden'>
                                    <span aria-hidden={true}>{session.user.name}</span>
                                    <span
                                        className='overflow-hidden overflow-ellipsis text-xs text-zinc-400'
                                        aria-hidden={true}>
                                        {session.user.email}
                                    </span>
                                </div>
                                <SignOutButton className='aspect-square h-full' />
                            </div>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div className='container max-h-screen w-full py-16 md:px-6 md:py-12'>{children}</div>
        </div>
    );
};

export default Layout;
