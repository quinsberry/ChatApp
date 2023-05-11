import React, { FunctionComponent } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loading: FunctionComponent = () => {
    return (
        <div className='flex w-full flex-col pt-7'>
            <Skeleton className='mb-7' height={48} width={268} />
            <Skeleton height={24} width={129} />
            <Skeleton className='mt-1' height={40} width={384} />
        </div>
    );
};

export default Loading;
