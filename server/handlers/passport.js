'use strict'

const jwt = require('jsonwebtoken')
const authorizeToken = require('./../utils/authorize')
const responseErrors = require('./../utils/errors/response')

function authenticateTokenJWT(req, res, done) {
  if (!req) {
    return done(new Error('Req is missing in authenticateToken function!'))
  }
  const parsedAuthHeader = parseAuthHeader(req.header('Authorization'))
  if (!parsedAuthHeader || !parsedAuthHeader.value
    || !parsedAuthHeader.scheme
    || parsedAuthHeader.scheme.toLowerCase() !== 'jwt'
  ) {
    return done()
  }
  return authorizeToken(parsedAuthHeader.value, res, done)
}

function authenticateUser(req, res, next) {
  authenticateTokenJWT(req, res, (err, data) => {
    if (err) {
      return next(err)
    } else if (!data || !data.user || !data.user.id) {
      return next(new responseErrors.UnauthorizedError())
    }
    req.user = data.user
    return next()
  })
}

function optionalToken(req, res, next) {
  const authHeader = req.header('Authorization')
  const parsedHeader = parseAuthHeader(authHeader)
  if (parsedHeader && parsedHeader.value) {
    const payload = jwt.decode(parsedHeader.value)
    req.user = { id: payload ? payload.userId : undefined }
  }
  return next()
}

function parseAuthHeader(hdrValue) {
  if (!hdrValue || typeof hdrValue !== 'string') {
    return null
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/)
  return matches && { scheme: matches[1], value: matches[2] }
}

module.exports = {
  optionalToken,
  parseAuthHeader,
  authenticateUser,
}
