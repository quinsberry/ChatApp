import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { ClassValue } from 'class-variance-authority/dist/types';
import { LoaderIcon } from '@/assets/icons/LoaderIcon';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva<Record<string, Record<string, ClassValue>>>(
    'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-slate-900 text-white hover:bg-slate-800',
                ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-2',
                lg: 'h-11 px-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isProcessing?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
    className,
    variant,
    isProcessing,
    size,
    children,
    ...props
}) => {
    return (
        <button className={cn(buttonVariants({ variant, size, className }))} disabled={isProcessing} {...props}>
            {isProcessing ? <LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
};
