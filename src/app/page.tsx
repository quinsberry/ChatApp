'use client';
import { Button } from '@/components/common/Button/Button';

export default function Home() {
    return (
        <div>
            <div className="text-red-500">hello world</div>
            <Button isProcessing={false}>button</Button>
        </div>
    );
}
