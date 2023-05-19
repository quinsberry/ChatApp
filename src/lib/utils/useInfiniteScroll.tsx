import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
    callback: () => void;
    trigger: any;
    direction: 'from-top-to-bottom' | 'from-bottom-to-top';
}
const SCALE_PX_FAULT = 50;
export const useInfiniteScroll = <RefType extends HTMLDivElement>({
    callback,
    trigger,
    direction = 'from-top-to-bottom',
}: UseInfiniteScrollProps) => {
    const [canScroll, setCanScroll] = useState(true);
    const containerRef = useRef<RefType>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let i = 0;
        const handleScroll = () => {
            const scrollTop = direction === 'from-top-to-bottom' ? container.scrollTop : -container.scrollTop;
            if (
                canScroll &&
                container &&
                scrollTop >= container.scrollHeight - container.offsetHeight - SCALE_PX_FAULT
            ) {
                if (i !== 0) return;
                i++;
                callback();
                setCanScroll(false);
            }
        };

        if (container) container.addEventListener('scroll', handleScroll);

        return () => {
            if (container) container.removeEventListener('scroll', handleScroll);
        };
    }, [canScroll, callback]);

    useEffect(() => {
        setCanScroll(true);
    }, [trigger]);

    return containerRef;
};
