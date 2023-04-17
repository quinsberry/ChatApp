import { child, get, onValue, push, ref, set, update as firebaseUpdate } from 'firebase/database';
import { db } from '@/lib/db/db';

interface Write {
    path: string;
    payload: any;
}
function write({ path, payload }: Write): Promise<void> {
    return set(ref(db, path), payload).catch(error => {
        console.error('Error writing to database: ', error);
    });
}

interface Watch {
    path: string;
    callback: (data: unknown) => void;
    onlyOnce?: boolean;
}
function watch({ path, callback, onlyOnce }: Watch): void {
    const starCountRef = ref(db, path);
    onValue(
        starCountRef,
        snapshot => {
            const data = snapshot.val();
            callback(data);
        },
        { onlyOnce }
    );
}

function read(path: string): Promise<unknown> {
    return get(child(ref(db), path))
        .then(snapshot => {
            return snapshot.exists() ? snapshot.val() : null;
        })
        .catch(error => {
            console.error('Error reading database: ', error);
        });
}

interface Update {
    path: string;
    pathsToUpdate: string[];
    payload: any;
}
function update({ payload, path, pathsToUpdate }: Update): Promise<void> {
    const newPathKey = push(child(ref(db), path)).key;

    const updates = {};
    pathsToUpdate.forEach(pathToUpdate => {
        updates[pathToUpdate + newPathKey] = payload;
    });
    return firebaseUpdate(ref(db), updates).catch(error => {
        console.error('Error updating database: ', error);
    });
}

function remove(path: string | string[]): Promise<void> {
    const parsedPath = Array.isArray(path) ? path : [path];
    const updates = {};
    parsedPath.forEach(pathToUpdate => {
        updates[pathToUpdate] = null;
    });
    return firebaseUpdate(ref(db), updates).catch(error => {
        console.error('Error deleting from database: ', error);
    });
}

export const DB = {
    write,
    watch,
    read,
    update,
    remove,
};
