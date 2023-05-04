import { forwardRef, SVGProps } from 'react';

interface LogoutProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
    className?: string;
}

export const Logout = forwardRef<SVGSVGElement, LogoutProps>(({ className, ...props }, ref) => {
    return (
        <svg
            ref={ref}
            className={className}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            {...props}>
            <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
            <polyline points='16 17 21 12 16 7'></polyline>
            <line x1='21' x2='9' y1='12' y2='12'></line>
        </svg>
    );
});
Logout.displayName = 'Logout';
