import { userInterface } from './../interfaces/userInterface'
import { auth, firestore } from '../connections/firebase'
import { Request, Response } from 'express'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import fetch from 'node-fetch'
import { summonerInterface } from '../interfaces/summonerInterface'

const getByName = "https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
const getById = "https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/"
class AuthController {
  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const body: userInterface = req.body
      const userAuth = await createUserWithEmailAndPassword(
        auth,
        body.email,
        body.password
      )
      const apiKey = await getDoc(doc(firestore, 'apiKey', 'riot'))

      if (!apiKey.exists())
        return res.status(404).json({ message: 'Chave de busca à Riot API não encontrada' })

      const urlByName = getByName + body.nickname + '?api_key=' + apiKey.data().key
      const riotResponseByName = await fetch(urlByName, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }
      })
      const summonerByName = await riotResponseByName.json()
      const urlById = getById + summonerByName.id + '?api_key=' + apiKey.data().key
      const riotResponseById = await fetch(urlById, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }
      })
      const summonerById: summonerInterface[] = await riotResponseById.json()
      const soloqData = summonerById.find(s => s.queueType == 'RANKED_SOLO_5x5')

      body.soloqData = soloqData

      delete body.password

      await setDoc(doc(firestore, 'user', userAuth.user.uid), body)

      body.id = userAuth.user.uid

      return res.status(200).json({ user: body })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const userAuth = await signInWithEmailAndPassword(auth, req.body.email, req.body.password)
      const user = await getDoc(doc(firestore, 'user', userAuth.user.uid))

      if (!user.exists())
        return res.status(404).json({ message: 'Usuário não encontrado.' })

      return res.status(200).json({ user: user.data() })
    } catch (error) {
      if (error.code == 'auth/user-not-found')
        return res.status(404).json({ message: 'Usuário não encontrado.' })

      return res.status(500).json(error)
    }
  }
}

export default new AuthController()
