import { Router } from 'express'
import AuthController from '../controllers/authController'
import DuoController from '../controllers/duoController'
import RoleController from '../controllers/roleController'

const routes = Router()
const prevUrl = '/duo-finder-api'

routes.get(prevUrl + '/user-by-id', AuthController.getUserById)

routes.post(prevUrl + '/user', AuthController.createUser)

routes.put(prevUrl + '/user', AuthController.updateUser)

routes.post(prevUrl + '/login', AuthController.login)

routes.get(prevUrl + '/key', AuthController.getRiotApiKey)

routes.get(prevUrl + '/champions', AuthController.getChampions)

routes.get(prevUrl + '/duo', DuoController.getDuos)

routes.post(prevUrl + '/duo', DuoController.createDuo)

routes.post(prevUrl + '/search-duo', DuoController.searchDuo)

routes.delete(prevUrl + '/duo', DuoController.deleteDuo)

routes.get(prevUrl + '/roles', RoleController.getRoles)

export default routes
