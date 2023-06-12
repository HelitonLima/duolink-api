export interface notificationInterface {
    id: string
    senderId: string
    senderNickname: string
    senderIcon: string
    reciverId: string
    message: string
    type: 'INVITE' | 'NOTICE'
    seen?: boolean
    accpeted?: boolean
    declined?: boolean
}
