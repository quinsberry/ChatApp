import { AssertionError } from 'assert';

export function assertType<T>(value: any, predicate: (value: any) => boolean, message?: string): asserts value is T {
    if (!predicate(value)) {
        throw new AssertionError({
            message: message ?? 'Unexpected type',
            actual: value,
        });
    }
}

export function assertNonNull<T>(value: T | null, message?: string): asserts value is T {
    if (value === null) {
        throw new AssertionError({
            message: message ?? 'Expected value to be non-null',
            actual: value,
            expected: 'non-null',
        });
    }
}
