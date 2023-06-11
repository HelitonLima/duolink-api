import express from 'express'
import cors from 'cors'
import routes from './utils/Routes'
import { Server } from 'socket.io'
import { userInterface } from './interfaces/userInterface'
import { notificationInterface } from './interfaces/notificationInterface'

export const io = new Server(3000, {
  cors: {
    origin: 'http://localhost:4200'
  }
})
const posts = []
const notifications: notificationInterface[] = []

io.on('connection', async (socket) => {
  console.log('a user connected')

  socket.on('posts', post => {
    posts.push(post)

    io.emit('posts', posts)
  })

  socket.on('get posts', () => {
    io.emit('posts', posts)
  })

  socket.on('notifications', (res: { notification: notificationInterface, user: userInterface }) => {
    if (notifications.some(n => n.reciverId === res.notification.reciverId && n.senderId === res.notification.senderId)) {
      socket.emit('notification already created')
    } else {
      notifications.push(res.notification)

      io.emit('get notifications')
    }
  })

  socket.on('get notifications', (id: string) => {
    const notificationsFiltered = notifications.filter(n => n.reciverId === id)

    socket.emit('notifications', notificationsFiltered)
  })

  socket.on('set notifications as seen', (user: userInterface) => {
    const notificationsFiltered = notifications.filter(n => n.reciverId === user.id)

    notificationsFiltered.map(n => {
      if (n.type === 'NOTICE' || n.accpeted) {
        n.seen = true
      }

      return n
    })

    socket.emit('notifications', notificationsFiltered)
  })

  socket.on('accept invite notification', (idNotification: string) => {
    const notification = notifications.find(n => n.id === idNotification)

    notification.accpeted = true
    notification.seen = true

    socket.emit('get notifications')
  })
})

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
