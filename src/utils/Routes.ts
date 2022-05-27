import { Router } from 'express'
import AuthController from '../controllers/authController'

const routes = Router()

routes.post('/user', AuthController.createUser)

routes.post('/login', AuthController.login)

export default routes
