'use strict'

const authorizeToken = require('../utils/authorize')
const events = require('./events')

const getRoomId = () => 1
const publishToClient = (client, type, message) => {
  if (!client || !type) {
    throw new Error('client and type is required when publishing new message')
  }
  client.emit(type, message)
}


let socketServer = null

const initPublish = server => {
  socketServer = server
  socketServer.on('connection', client => {
    client.on('authentication', data => {
      authorizeToken(data.accessToken, null, (err, tokenData) => {
        if (err || !tokenData || (tokenData && (!tokenData.user || !tokenData.user.id))) {
          return publishToClient(client, events.SOCKET_NOTIFICATION_MESSAGE_TYPE.AUTHENTICATED_ERROR.type, err)
        }
        publishToClient(client, events.SOCKET_NOTIFICATION_MESSAGE_TYPE.AUTHENTICATED.type)
        const roomId = getRoomId(tokenData.user.id)
        return client.join(roomId)
      })
    })
    client.on('subscribeToExchangeRateChange', () => {
      publishToClient(client, 'exchangeRateChange')
      const roomId = 1
      return client.join(roomId)
    })
  })
}

const publishToUser = (userId, type, message) => {
  if (!userId || !type) {
    throw new Error('userId and type is required when publishing new message')
  }
  return socketServer.to(getRoomId(userId))
    .emit(type, message)
}

const publishExchangeRateChange = exchangeRateChange => {
  if (!exchangeRateChange) {
    throw new Error('exchangeRateChange is required when publishing new message')
  }
  return socketServer.to(getRoomId())
    .emit('exchangeRateChange', exchangeRateChange)
}

module.exports = {
  publishToUser,
  initPublish,
  publishExchangeRateChange,
}
