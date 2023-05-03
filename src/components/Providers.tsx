'use client';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
    children: ReactNode;
}
export const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
    return (
        <Fragment>
            <Toaster position='top-center' reverseOrder={false} />
            {children}
        </Fragment>
    );
};
