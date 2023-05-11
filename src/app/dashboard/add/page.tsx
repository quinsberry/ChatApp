import React, { FunctionComponent } from 'react';
import { AddFriendForm } from '@/components/AddFriendForm';

const page: FunctionComponent = () => {
    return (
        <main className='pt-8'>
            <h1 className='mb-8 text-5xl font-bold'>Add a friend</h1>
            <AddFriendForm />
        </main>
    );
};
export default page;
