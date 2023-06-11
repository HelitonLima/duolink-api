import { userInterface } from './../interfaces/userInterface'
import { auth, firestore } from '../connections/firebase'
import { Request, Response } from 'express'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import fetch from 'node-fetch'
import { summonerInterface } from '../interfaces/summonerInterface'

// Url de referência da Riot que retorna alguns dados de perfil com base no nick do jogador
const getByName = 'https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
// Url de referência da Riot que retorna mais alguns dados de perfil com base no id do jogador
const getById = 'https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/'

class AuthController {
  public async createUser (req: Request, res: Response): Promise<Response> {
    try {
      const body: userInterface = req.body
      const userAuth = await createUserWithEmailAndPassword(
        auth,
        body.email,
        body.password
      )
      // Pega a apiKey armazenada no Firebase Firestore
      const apiKey = await getDoc(doc(firestore, 'apiKey', 'riot'))

      // Verifica se alguma apiKey foi encontrada
      if (!apiKey.exists()) { return res.status(404).json({ message: 'Chave de busca à Riot API não encontrada' }) }

      // Adicionando informações complementares para requisição
      const urlByName = getByName + body.nickname + '?api_key=' + apiKey.data().key
      // Utilizando fetch para fazer a requisição e pegar dados usando o nick do jogador
      const riotResponseByName = await fetch(urlByName, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
      const summonerByName = await riotResponseByName.json()
      // Utilizando fetch para fazer a requisição e pegar dados usando o id do jogador retornado pela requisição usando o nick
      const urlById = getById + summonerByName.id + '?api_key=' + apiKey.data().key
      const riotResponseById = await fetch(urlById, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
      const summonerById: summonerInterface[] = await riotResponseById.json()

      // Dados devidamente recebidos da base da Riot
      const soloqData = summonerById.find(s => s.queueType === 'RANKED_SOLO_5x5')

      body.soloqData = soloqData
      body.icon = '/assets/images/2015_Master_Poro.png'
      body.favoritesChamps = []

      delete body.password

      body.id = userAuth.user.uid

      await setDoc(doc(firestore, 'user', userAuth.user.uid), body)

      return res.status(200).json({ user: body })
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') { return res.status(409).json({ message: 'Este e-mail já foi cadastrado.' }) }

      return res.status(500).json(error)
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    try {
      // Chama função do Firebase Auth que realiza login a partir do email e senha
      const userAuth = await signInWithEmailAndPassword(auth, req.body.email, req.body.password)
      // Pega os dados do usuário com base o uid (user identification) retornado do Firebase Auth
      const user = await getDoc(doc(firestore, 'user', userAuth.user.uid))

      // Verifica se algum usuário foi encontrado
      if (!user.exists()) { return res.status(404).json({ message: 'Usuário não encontrado.' }) }

      // Retorna os dados do usuário
      return res.status(200).json({ user: user.data() })
    } catch (error) {
      if (error.code === 'auth/user-not-found') { return res.status(404).json({ message: 'Usuário não encontrado.' }) }

      if (error.code === 'auth/wrong-password') { return res.status(403).json({ message: 'Senha incorreta.' }) }

      return res.status(500).json(error)
    }
  }

  public async getRiotApiKey (req: Request, res: Response): Promise<Response> {
    try {
      const apiKey = await getDoc(doc(firestore, 'apiKey', 'riot'))

      return res.status(200).json({ ...apiKey.data() })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  public async updateUser (req: Request, res: Response): Promise<Response> {
    try {
      const body: userInterface = req.body
      // Pega a apiKey armazenada no Firebase Firestore
      const apiKey = await getDoc(doc(firestore, 'apiKey', 'riot'))

      // Verifica se alguma apiKey foi encontrada
      if (!apiKey.exists()) { return res.status(404).json({ message: 'Chave de busca à Riot API não encontrada' }) }

      // Adicionando informações complementares para requisição
      const urlByName = getByName + body.nickname + '?api_key=' + apiKey.data().key
      // Utilizando fetch para fazer a requisição e pegar dados usando o nick do jogador
      const riotResponseByName = await fetch(urlByName, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
      const summonerByName = await riotResponseByName.json()
      // Utilizando fetch para fazer a requisição e pegar dados usando o id do jogador retornado pela requisição usando o nick
      const urlById = getById + summonerByName.id + '?api_key=' + apiKey.data().key
      const riotResponseById = await fetch(urlById, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
      const summonerById: summonerInterface[] = await riotResponseById.json()

      // Dados devidamente recebidos da base da Riot
      const soloqData = summonerById.find(s => s.queueType === 'RANKED_SOLO_5x5')

      body.soloqData = soloqData

      await setDoc(doc(firestore, 'user', body.id), body)

      return res.status(200).json({ user: body })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}

export default new AuthController()
