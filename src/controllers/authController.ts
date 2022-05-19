/* import { userInterface } from './../interfaces/userInterface'
import { auth, firestore } from '../firebase/firebaseServices'
import { loginInterface } from '../interfaces/loginInterface'
import bcrypt from 'bcrypt' */

import { Request, Response } from 'express'

class AuthController {
  public async teste (req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ json: 'teste1' })
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
