'use strict'

const crypto = require('crypto')
const config = require('config')
const jwt = require('jsonwebtoken')
const createAccessToken = require('./../repositories/accessToken').create

const generateRandomToken = () => crypto.randomBytes(32).toString('hex')

const generateUserJwtToken = (payload, dbTransaction) => {
  if (!payload.userId) {
    throw new Error('Missing userId when creating user Token')
  }
  payload.hash = generateRandomToken()
  const jwtToken = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiration })
  return createAccessToken(payload.userId, jwtToken, Date.now() + (config.jwt.expiration * 1000), Date.now(), dbTransaction)
    .then(() => jwtToken)
}

const generateAdminJwtToken = payload => {
  if (!payload.adminId) {
    throw new Error('Missing adminId when creating admin Token')
  }
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiration })
}

module.exports = {
  generateRandomToken,
  generateUserJwtToken,
  generateAdminJwtToken,
}
