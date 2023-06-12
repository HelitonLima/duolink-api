export interface userDuoInterface {
    id: string,
    icon: string,
    nickname: string
}

export interface duoInterface {
    id?: string,
    users: userDuoInterface[],
    usersId: string[]
}
