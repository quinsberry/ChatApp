'use client';
import { FunctionComponent, useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { Google } from '@/components/common/icons/Google';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Github } from '@/components/common/icons/Github';

interface LoginPageProps {}
const LoginPage: FunctionComponent<LoginPageProps> = ({}) => {
    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const loginWithGoogle = async () => {
        setIsLoading(true);
        signIn('google')
            .catch(error => {
                console.error(error);
                toast.error('Something went wrong');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    const loginWithGithub = async () => {
        setIsLoading(true);
        signIn('github')
            .catch(error => {
                console.error(error);
                toast.error('Something went wrong');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    return (
        <main className='flex min-h-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
            <div className='flex w-full max-w-md flex-col items-center space-y-8'>
                <div className='flex flex-col items-center gap-8'>
                    logo
                    <h2 className='my-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                        Sign in to your account
                    </h2>
                </div>
            </div>

            <Button
                isInProgress={isLoading}
                type='button'
                className='mx-auto w-full max-w-sm'
                onClick={loginWithGoogle}>
                {isLoading ? null : <Google className='mr-2 h-4 w-4' />}
                Google
            </Button>
            <Button
                isInProgress={isLoading}
                type='button'
                className='mx-auto mt-2 w-full max-w-sm'
                onClick={loginWithGithub}>
                {isLoading ? null : <Github className='mr-2 h-4 w-4' />}
                Github
            </Button>
        </main>
    );
};
export default LoginPage;
