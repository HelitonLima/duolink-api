export interface chatMessageInterface {
    senderIdUser: string,
    reciverIdUser: string,
    message: string
}

export interface chatInterface {
    users: string[],
    messages: chatMessageInterface[]
}
