'use strict'

const io = require('socket.io')
const { createClient } = require('redis')
const adapter = require('socket.io-redis')
const { initPublish } = require('./publish')
const { parseRedisConnectionString } = require('../utils/redisUtils')
const config = require('config')

const redisConnectionString = config.get('redis').connectionString
const redisConfig = parseRedisConnectionString(redisConnectionString)

console.log('Initializing socket connection...')

const socketInit = server => {
  const socketServer = io.listen(server)
  const pub = createClient(redisConfig.port, redisConfig.host, { auth_pass: redisConfig.password }) // eslint-disable-line camelcase
  const sub = createClient(redisConfig.port, redisConfig.host, { auth_pass: redisConfig.password }) // eslint-disable-line camelcase
  socketServer.adapter(adapter({ pubClient: pub, subClient: sub }))
  initPublish(socketServer)
  return socketServer
}

module.exports = { socketInit }
