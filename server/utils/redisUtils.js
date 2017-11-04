'use strict'

const parseRedisConnectionString = connectionString => {
  const parsedString = connectionString.split(':')[2].split('@')
  return {
    host: parsedString[1],
    port: Number.parseInt(connectionString.split(':')[3]),
    password: parsedString[0],
  }
}

module.exports = { parseRedisConnectionString }
