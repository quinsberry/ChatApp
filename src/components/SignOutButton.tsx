'use client';
import React, { ButtonHTMLAttributes, FunctionComponent, useState } from 'react';
import { Button } from '@/components/common/Button';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';

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
            {isSigningOut ? <Loader2 className='h-4 w-4' /> : <LogOut className='h-4 w-4' />}
        </Button>
    );
};
