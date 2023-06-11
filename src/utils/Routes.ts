import { Router } from 'express'
import AuthController from '../controllers/authController'
import DuoController from '../controllers/duoController'
import RoleController from '../controllers/roleController'

const routes = Router()
const prevUrl = '/duo-finder-api'

routes.post(prevUrl + '/user', AuthController.createUser)

routes.put(prevUrl + '/user', AuthController.updateUser)

routes.post(prevUrl + '/login', AuthController.login)

routes.get(prevUrl + '/key', AuthController.getRiotApiKey)

routes.post(prevUrl + '/duo', DuoController.duo)

routes.get(prevUrl + '/roles', RoleController.getRoles)

export default routes
