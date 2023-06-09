import { firestore } from '../connections/firebase'
import { Request, Response } from 'express'
import { doc, getDoc } from 'firebase/firestore'

class RoleController {
  public async getRoles (req: Request, res: Response): Promise<Response> {
    try {
        const roles = await getDoc(doc(firestore, 'roles', 'roles'))

        return res.status(200).json({ ...roles.data() })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}

export default new RoleController()
