'use strict'

const responseErrors = require('./errors/response')
const VerifyTokenPayloadService = require('../services/VerifyTokenPayload')
const appErrors = require('./errors/app')
const jwt = require('jsonwebtoken')

const authorizeToken = (token, res, done) => {
  const jwtPayload = jwt.decode(token)
  if (!jwtPayload || !jwtPayload.exp || (Date.now() / 1000) >= jwtPayload.exp) {
    return done()
  }
  return new VerifyTokenPayloadService().execute({
    token,
    userId: jwtPayload.userId ? jwtPayload.userId : undefined,
    adminId: jwtPayload.adminId ? jwtPayload.adminId : undefined,
    tokenIssuedAt: jwtPayload.iat,
  }).then(data => {
    if (res && data.loginTimeout && data.loginIdleTimeout) {
      res.setHeader('Login-timeout', data.loginTimeout)
      res.setHeader('Login-idle-timeout', data.loginIdleTimeout)
    }
    done(null, data)
    return null
  })
    .catch(appErrors.NotFoundError, () => done())
    .catch(appErrors.ValidationError, () => done())
    .catch(appErrors.TokenIdleTimoutError, () => done(new responseErrors.IdleTimeoutError()))
    .catch(appErrors.InvalidDataError, reason => {
      const conflict = { clientRefreshRequired: true, clientRefreshReasons: reason.message }
      return done(new responseErrors.ConflictError(conflict))
    })
    .catch(appErrors.TokenRevokedError, () => done())
    .catch(done)
}

module.exports = authorizeToken
