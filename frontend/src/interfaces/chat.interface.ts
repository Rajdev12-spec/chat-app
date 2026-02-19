export interface MessageData {
    _id: string,
    conversation: string,
    sender: {
        _id: string,
        firstName: string,
        lastName: string
    },
    text: string,
    seenBy: string[],
    createdAt: string,
    updatedAt: string,
}