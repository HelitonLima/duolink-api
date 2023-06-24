import { Request, Response } from 'express'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../connections/firebase'
import { duoInterface, userDuoInterface } from '../interfaces/duoInterface'
import { userInterface } from '../interfaces/userInterface'

class DuoController {
  public async createDuo (req: Request, res: Response): Promise<Response> {
    try {
    //   const userCollection = collection(firestore, 'user')
    //   const canPlayTier = await getDoc(doc(firestore, 'canPlayTiers', String(req.body.soloqData.tier)))
    //   const tiers: string[] = canPlayTier.data().tiers
    //   let users = []

      //   for (const tier of tiers) {
      //     const content = await getDocs(query(userCollection, where('soloqData.tier', '==', tier)))

      //     if (!content.empty) {
      //       content.forEach(data => {
      //         const user: userInterface = data.data() as any

      //         users.push(user)
      //       })
      //     }
      //   }

      //   const filteresUsers = []

      //   for (const user of users) {
      //     let checkPlayRole = false
      //     let checkSearchRole = false

      //     for (let i = 0; i < user.playRole.length; i++) {
      //       if (req.body.searchRole.indexOf(user.playRole[i]) > -1) {
      //         checkPlayRole = true
      //       }
      //     }

      //     for (let i = 0; i < req.body.playRole.length; i++) {
      //       if (user.searchRole.indexOf(req.body.playRole[i]) > -1) {
      //         checkSearchRole = true
      //       }
      //     }

      //     if (checkPlayRole && checkSearchRole) {
      //       filteresUsers.push(user)
      //     }
      //   }

      //   users = filteresUsers

      const duo: duoInterface = req.body

      const duoRes = await addDoc(collection(firestore, 'duo'), duo)

      duo.id = duoRes.id

      return res.status(200).json(duo)
    } catch (error) {
      console.error(error)

      return res.status(500).json(error)
    }
  }

  public async getDuos (req: Request, res: Response): Promise<Response> {
    try {
      const idUser = req.query.idUser
      const duosCollection = collection(firestore, 'duo')
      const duos: duoInterface[] = []
      const resDuos = await getDocs(query(duosCollection, where('usersId', 'array-contains', idUser)))

      if (!resDuos.empty) {
        resDuos.forEach(async data => {
          const duo: duoInterface = data.data() as any

          duo.id = data.id

          duos.push(duo)
        })
      }

      for (let i = 0; i < duos.length; i++) {
        const duo = duos[i]
        const newUsers: userDuoInterface[] = []

        for (const userDuoId of duo.usersId) {
          const user = await getDoc(doc(firestore, 'user', userDuoId))

          newUsers.push({
            icon: user.data().icon,
            id: user.data().id,
            nickname: user.data().nickname
          })
        }

        duo.users = newUsers
      }

      return res.status(200).json(duos)
    } catch (error) {
      console.error(error)

      return res.status(500).json(error)
    }
  }

  public async deleteDuo (req: Request, res: Response): Promise<Response> {
    try {
      const idDuo = req.query.idDuo

      await deleteDoc(doc(firestore, 'duo', String(idDuo)))

      return res.status(200).json({})
    } catch (error) {
      console.error(error)

      return res.status(500).json(error)
    }
  }

  public async searchDuo (req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body
      const userCollection = collection(firestore, 'user')
      const whereNick = where('nickname', '==', body.nickname)
      const whereTier = where('soloqData.tier', 'in', body.tiers)
      const whereRoles = where('roles', 'array-contains-any', body.roles)
      const wheres: any = []
      const users = []

      if (body.champions.length > 0) {
        for (const c of body.champions) {
          const whereChampions = where('favoritesChamps', 'array-contains', c)
          const wheresC = []

          if (body.nickname) {
            wheresC.push(whereNick)
          }

          if (body.tiers.length > 0) {
            wheresC.push(whereTier)
          }

          wheresC.push(whereChampions)

          const userQueryC = query(userCollection, ...wheresC)
          const contentC = await getDocs(userQueryC)

          if (!contentC.empty) {
            contentC.forEach(data => {
              const user: userInterface = data.data() as any

              if (!users.some(u => u.id === user.id)) {
                if (user.id !== body.idUser) {
                  users.push(user)
                }
              }
            })
          }
        }
      } else {
        if (body.nickname) {
          wheres.push(whereNick)
        }

        if (body.tiers.length > 0) {
          wheres.push(whereTier)
        }

        if (body.roles.length > 0) {
          wheres.push(whereRoles)
        }

        const userQuery = query(userCollection, ...wheres)
        const content = await getDocs(userQuery)

        if (!content.empty) {
          content.forEach(data => {
            const user: userInterface = data.data() as any

            if (user.id !== body.idUser) {
              users.push(user)
            }
          })
        }
      }

      return res.status(200).json(users)
    } catch (error) {
      console.error(error)

      return res.status(500).json(error)
    }
  }
}

export default new DuoController()
