import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const DashboardPage: () => Promise<JSX.Element> = async () => {
    const session = await getServerSession(authOptions);
    return (
        <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    );
};

export default DashboardPage;
