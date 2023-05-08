'use client';
import { FunctionComponent, useState } from 'react';
import { Button } from '@/components/common/Button';
import { Google } from '@/components/common/icons/Google';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Github } from '@/components/common/icons/Github';
import { Logo, ShortLogo } from '@/components/common/icons/Logo';

interface LoginPageProps {}
const LoginPage: FunctionComponent<LoginPageProps> = ({}) => {
    const [isLoggingWithGoogle, setIsLoggingWithGoogle] = useState(false);
    const [isLoggingWithGithub, setIsLoggingWithGithub] = useState(false);
    const loginWithGoogle = async () => {
        setIsLoggingWithGoogle(true);
        signIn('google')
            .catch(error => {
                console.error(error);
                toast.error('Something went wrong');
            })
            .finally(() => {
                setIsLoggingWithGoogle(false);
            });
    };
    const loginWithGithub = async () => {
        setIsLoggingWithGithub(true);
        signIn('github')
            .catch(error => {
                console.error(error);
                toast.error('Something went wrong');
            })
            .finally(() => {
                setIsLoggingWithGithub(false);
            });
    };
    return (
        <main className='flex min-h-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
            <div className='flex w-full max-w-md flex-col items-center space-y-8'>
                <div className='flex flex-col items-center'>
                    <div className='flex items-center justify-center gap-1'>
                        <ShortLogo className='h-12 w-auto' />
                        <Logo className='h-12 w-auto' />
                    </div>
                    <h2 className='my-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                        Sign in to your account
                    </h2>
                </div>
            </div>

            <Button
                isInProgress={isLoggingWithGoogle}
                type='button'
                className='mx-auto w-full max-w-sm'
                onClick={loginWithGoogle}>
                {isLoggingWithGoogle ? null : <Google className='mr-2 h-4 w-4' />}
                Google
            </Button>
            <Button
                isInProgress={isLoggingWithGithub}
                type='button'
                className='mx-auto mt-2 w-full max-w-sm'
                onClick={loginWithGithub}>
                {isLoggingWithGithub ? null : <Github className='mr-2 h-4 w-4' />}
                Github
            </Button>
        </main>
    );
};
export default LoginPage;
