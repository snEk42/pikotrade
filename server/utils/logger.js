'use strict'

const config = require('config')
const bunyan = require('bunyan')

const logger = bunyan.createLogger({
  name: 'General',
  streams: getStreamsByEnvironment(),
})

const serviceLogger = bunyan.createLogger({
  name: 'Services',
  streams: getStreamsByEnvironment(),
})

const errorLogger = bunyan.createLogger({
  name: 'Errors',
  streams: getStreamsByEnvironment(),
})

function CustomStream() {}
CustomStream.prototype.write = rec => {
  if (rec.err && rec.err.stack) {
    // Unexpected errors
    console.error(`${rec.name} Logger:`)
    console.error(rec.err.stack)
  } else if (rec.msg) {
    // Service errors, logs
    console.log(`${rec.name} Logger: ${rec.msg}`)
  } else if (rec.error) {
    // Response errors
    console.log(`${rec.name} Logger: ${JSON.stringify(rec.error)}`)
  }
}

function getStreamsByEnvironment() {
  const streams = []
  if (config.logger.stdout) {
    streams.push({
      name: 'console',
      stream: new CustomStream(),
      type: 'raw',
      level: config.logger.minLevel,
    })
  }
  return streams
}

module.exports = {
  logger,
  serviceLogger,
  errorLogger,
}
