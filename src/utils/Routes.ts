import { Router } from 'express'
import AuthController from '../controllers/authController'

const routes = Router()

routes.get('/teste', AuthController.teste)

export default routes
