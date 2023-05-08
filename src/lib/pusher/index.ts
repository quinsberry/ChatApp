export function transformToPusherKey(key: string): string {
    return key.replace(/:/g, '__');
}
