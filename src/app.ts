import express from 'express'
import cors from 'cors'
import routes from './utils/Routes'
import { Server } from 'socket.io'
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { firestore } from "./connections/firebase"
import { userInterface } from "./interfaces/userInterface";

export const io = new Server(3000, {
  cors: {
    origin: 'http://localhost:4200'
  }
})

io.on('connection', async (socket) => {
  console.log('a user connected')

  io.emit('new user')
});


class App {
  public express: express.Application

  public constructor () {
    this.express = express()

    this.middlewares()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private routes (): void {
    this.express.use(routes)
  }
}

export default new App().express
