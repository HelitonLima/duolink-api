import { Request, Response } from "express"
import { collection, doc, getDoc, getDocs, onSnapshot, query, QueryConstraint, where } from "firebase/firestore"
import { io } from "../app"
import { firestore } from "../connections/firebase"
import { userInterface } from "../interfaces/userInterface";

class DuoController {
    public async duo(req: Request, res: Response): Promise<Response> {
        try {
            const userCollection = collection(firestore, 'user')
            const canPlayTier = await getDoc(doc(firestore, 'canPlayTiers', String(req.body.soloqData.tier)))
            const tiers: string[] = canPlayTier.data().tiers
            let users = []

            for (let tier of tiers) {
                const content = await getDocs(query(userCollection, where('soloqData.tier', '==', tier)))

                if (!content.empty) {
                    content.forEach(data => {
                        const user: userInterface = data.data() as any

                        users.push(user)
                    })
                }
            }

            let filteresUsers = []

            for (let user of users) {
                let checkPlayRole = false
                let checkSearchRole = false

                for (var i = 0; i < user.playRole.length; i++)
                    if (req.body.searchRole.indexOf(user.playRole[i]) > -1)
                        checkPlayRole = true

                for (var i = 0; i < req.body.playRole.length; i++)
                    if (user.searchRole.indexOf(req.body.playRole[i]) > -1)
                        checkSearchRole = true

                if (checkPlayRole && checkSearchRole)
                    filteresUsers.push(user)
            }

            users = filteresUsers

            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default new DuoController()