'use client';
import React, { ButtonHTMLAttributes, FunctionComponent, useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Logout } from '@/components/common/icons/Logout';
import { Loader } from '@/components/common/icons/Loader';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignOutButton: FunctionComponent<SignOutButtonProps> = ({ ...props }) => {
    const [isSigningOut, setIsSigningOut] = useState(false);
    const onSignOutClick = async () => {
        setIsSigningOut(true);
        signOut()
            .finally(() => {
                setIsSigningOut(false);
            })
            .catch(error => {
                toast.error('There was a problem signing out');
            });
    };
    return (
        <Button {...props} variant='ghost' onClick={onSignOutClick}>
            {isSigningOut ? <Loader className='h-4 w-4' /> : <Logout className='h-4 w-4' />}
        </Button>
    );
};
