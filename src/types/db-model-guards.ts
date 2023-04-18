export const isUser = (user: any): user is User => {
    return (
        typeof user.id === 'string' &&
        typeof user.name === 'string' &&
        typeof user.email === 'string' &&
        typeof user.image === 'string'
    );
};
