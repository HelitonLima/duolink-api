import express from 'express'
import cors from 'cors'
import routes from './utils/Routes'
import { Server } from 'socket.io'
import { userInterface } from './interfaces/userInterface'
import { notificationInterface } from './interfaces/notificationInterface'
import { chatInterface, chatMessageInterface } from './interfaces/chatInterface'

export const io = new Server(3000, {
  cors: {
    origin: 'http://localhost:4200'
  }
})
const posts = []
const notifications: notificationInterface[] = []
const chats: chatInterface[] = []

io.on('connection', async (socket) => {
  console.log('a user connected')

  socket.on('posts', post => {
    posts.push(post)

    io.emit('posts', posts)
  })

  socket.on('get posts', () => {
    io.emit('posts', posts)
  })

  socket.on('create chat', (users: string[]) => {
    const chatAlreadyCreated = () => chats.some(c => {
      let chatCreated = false

      if (c.users.some(u => u === users[0]) && c.users.some(u => u === users[1])) {
        chatCreated = true
      }

      return chatCreated
    })

    if (!chatAlreadyCreated()) {
      chats.push({ users, messages: [] })
    }

    io.emit('get chat')
  })

  socket.on('get chat', (users: string[]) => {
    const chatFiltered = chats.find(c =>
      c.users.some(u => u === users[0]) &&
      c.users.some(u => u === users[1]))

    socket.emit('chat', chatFiltered)
  })

  socket.on('send msg', (msg: chatMessageInterface) => {
    const chatFiltered = chats.find(c =>
      c.users.some(u => u === msg.senderIdUser) &&
        c.users.some(u => u === msg.reciverIdUser))

    chatFiltered.messages.push(msg)

    io.emit('get chat')
  })

  socket.on('notifications', (res: { notification: notificationInterface, user: userInterface }) => {
    if (notifications.find(n =>
      n.reciverId === res.notification.reciverId &&
        n.senderId === res.notification.senderId &&
        res.notification.type === 'INVITE'
    )?.declined) {
      socket.emit('notification declined')
    } else {
      notifications.push(res.notification)

      io.emit('get notifications')

      if (res.notification.type === 'INVITE' && res.notification.accpeted !== true) {
        socket.emit('notification sended')
      }
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

  socket.on('deny invite notification', (idNotification: string) => {
    notifications.map(n => {
      if (n.id === idNotification) {
        n.declined = true
        n.seen = true
      }

      return n
    })

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
