import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/common/icons/Logo';
import { SignOutButton } from '@/components/SignOutButton/SignOutButton';
import { FriendRequestsSidebarOption } from '@/components/FriendRequestsSidebarOption/FriendRequestsSidebarOption';
import { UserPlus } from 'lucide-react';
import { getUserFriendRequestIds } from '@/lib/redis/api';

interface LayoutProps {
    children: ReactNode;
}
interface SidebarOption {
    id: number;
    name: string;
    href: string;
    Icon: Icon;
}

const Icons = {
    Logo,
    UserPlus,
};
type Icon = keyof typeof Icons;

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    },
];

export const metadata = {
    title: 'Realtime chat app | Dashboard',
    description: 'Your dashboard',
};

const Layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        notFound();
    }
    const unseenRequestCount = (await getUserFriendRequestIds(session.user.id)).length;
    return (
        <div className='flex h-screen w-full'>
            <aside className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                    <Logo className='h-8 w-auto text-indigo-600' />
                </Link>
                <div className='text-xs font-semibold leading-6 text-gray-400'>Your chats</div>
                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                        <li>// chats that this user has</li>
                        <li>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>Overview</div>
                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sidebarOptions.map(option => {
                                    const Icon = Icons[option.Icon];
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className='group flex gap-3 rounded-md p-2 font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'>
                                                <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
                                                    <Icon className='h-4 w-4' />
                                                </span>

                                                <span className='truncate'>{option.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                        <li>
                            <FriendRequestsSidebarOption
                                sessionId={session.user.id}
                                initUnseenRequestCount={unseenRequestCount}
                            />
                        </li>
                        <li className='-mx-6 mt-auto flex items-center'>
                            <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill={true}
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image ?? ''}
                                        alt='Your profile picture'
                                    />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                    <span aria-hidden={true}>{session.user.name}</span>
                                    <span className='text-xs text-zinc-400' aria-hidden={true}>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>

                            <SignOutButton className='aspect-square h-full' />
                        </li>
                    </ul>
                </nav>
            </aside>
            {children}
        </div>
    );
};

export default Layout;
