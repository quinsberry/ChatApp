export const createChatHref = (id1: string, id2: string): string => {
    const [sortedId1, sortedId2] = [id1, id2].sort();
    return `${sortedId1}--${sortedId2}`;
};
