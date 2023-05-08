import './globals.css';
import { Providers } from '@/components/Providers';
import '@/lib/config/env';

export const metadata = {
    title: 'ChatApp',
    description: 'Realtime chat application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
