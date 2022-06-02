import { Router } from 'express'
import AuthController from '../controllers/authController'
import DuoController from '../controllers/duoController'

const routes = Router()

routes.post('/user', AuthController.createUser)

routes.post('/login', AuthController.login)

routes.post('/duo', DuoController.duo)

export default routes
