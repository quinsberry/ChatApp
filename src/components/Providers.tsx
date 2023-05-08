'use client';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import { toast, Toast, ToastBar, Toaster } from 'react-hot-toast';
import { X } from 'lucide-react';

interface ProvidersProps {
    children: ReactNode;
}

const CustomToaster = (t: Toast) => {
    return (
        <ToastBar toast={t}>
            {({ icon, message }) => (
                <>
                    {icon}
                    {message}
                    {t.type === 'error' && (
                        <button onClick={() => toast.dismiss(t.id)}>
                            <X />
                        </button>
                    )}
                </>
            )}
        </ToastBar>
    );
};
export const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
    return (
        <Fragment>
            <Toaster
                position='top-center'
                reverseOrder={false}
                toastOptions={{
                    error: {
                        duration: 60 * 1000,
                    },
                }}>
                {t => CustomToaster(t)}
            </Toaster>
            {children}
        </Fragment>
    );
};
