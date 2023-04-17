import { DB } from '@/lib/db/basic-operations';

function test() {
    DB.write({ path: 'test', payload: 'hello' });
}
