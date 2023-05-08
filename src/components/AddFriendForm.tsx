'use client';
import { FunctionComponent, useState } from 'react';
import { Button } from '@/components/common/Button';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addFriendValidator } from '@/lib/validators/addFriendValidator';

type FormData = z.infer<typeof addFriendValidator>;

interface AddFriendFormProps {}

export const AddFriendForm: FunctionComponent<AddFriendFormProps> = ({}) => {
    const [showSuccessState, setShowSuccessState] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator),
    });

    const addFriend = async (email: string): Promise<void> => {
        const emailValidation = addFriendValidator.safeParse({ email });
        if (!emailValidation.success) {
            return setError('email', { message: emailValidation.error.message });
        }

        return axios
            .post('/api/friends/add', {
                email,
            })
            .then(() => setShowSuccessState(true))
            .catch(error => {
                if (error instanceof AxiosError) {
                    return setError('email', { message: error.response?.data });
                }

                setError('email', { message: 'Something went wrong.' });
            });
    };
    const onSubmit = async (data: FormData): Promise<void> => addFriend(data.email);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
            <label htmlFor='email' className='block text-sm font-medium leading-6 text-green-900'>
                Add friend by Email
            </label>
            <div className='mt-2 flex gap-4'>
                <input
                    {...register('email')}
                    type='text'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='you@example.com'
                />
                <Button type='submit' isInProgress={isSubmitting}>
                    Add
                </Button>
            </div>
            {errors.email ? <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p> : null}
            {!errors.email && !isSubmitting && showSuccessState ? (
                <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>
            ) : null}
        </form>
    );
};
