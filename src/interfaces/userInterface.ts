import { summonerInterface } from './summonerInterface'

export interface userInterface{
    id?: string
    email: string
    password?: string
    nickname: string
    roles: string[]
    soloqData?: summonerInterface
    favoritesChamps?: string[]
    icon?: string
}
