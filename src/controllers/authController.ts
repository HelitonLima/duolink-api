import { userInterface } from './../interfaces/userInterface'
import { auth, firestore } from '../connections/firebase'
import { Request, Response } from 'express'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import fetch from 'node-fetch'
import { summonerInterface } from '../interfaces/summonerInterface'

const getByName = "https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
const getById = "https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/"
class AuthController {
  public async createUser (req: Request, res: Response): Promise<Response> {
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

      return res.status(200).json({ auth: userAuth, user: body })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    try {
      const login = await signInWithEmailAndPassword(auth, req.body.email, req.body.password)

      return res.status(200).json(login)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  /*   public async login (req: Request, res: Response): Promise<Response> {
    try {
      console.log('Init login: ' + JSON.stringify(req.body))
      const response: any = await auth().signInWithEmailAndPassword(req.body.email, req.body.password)

      const data = await firestore()
        .collection('User')
        .doc(response.user.uid)
        .get()

      const user: loginInterface = data.data()

      user.id = response.user.uid
      delete user.password

      const token = response.user.toJSON().stsTokenManager
      delete token.apiKey

      console.log('Login done')
      return res.status(200).json({ user, token })
    } catch (err) {
      console.error(err)
      return res.status(401).json({ message: 'Acesso não autorizado.' })
    }
  }

  public async createNewUser (req: Request, res: Response): Promise<Response> {
    const data: userInterface = req.body
    const hash = await bcrypt.hash(data.password, 10)

    console.log('Init create new user: ' + JSON.stringify(data))
    try {
      const result = await auth().createUserWithEmailAndPassword(data.email, data.password)

      data.password = hash
      await firestore().collection('User').doc(result.user.uid).set({
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username
      })
      console.log('Create user successful')
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
    } catch (err) {
      if (err.message === 'The email address is already in use by another account.') { return res.status(409).json({ message: 'Esse e-mail já foi cadastrado.' }) } else { res.status(500).json({ message: 'Ocorreu um erro no cadastro do usuário' }) }
      console.error(err)
    }
  }

  public async logout (req: Request, res: Response): Promise<Response> {
    console.log('Init logout')
    try {
      const response = await auth().signOut()
      console.log('Logout successfully')
      return res.status(200).json(response)
    } catch (err) {
      console.error('Erro no logout' + err.message)
      return res.status(500).json({ message: 'Logout error' })
    }
  } */
}

export default new AuthController()
