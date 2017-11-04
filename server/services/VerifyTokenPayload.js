'use strict'

const Promise = require('bluebird')
const AbstractService = require('./abstract')
const userRepository = require('./../repositories/user')
const adminRepository = require('./../repositories/admin')
const accessTokenRepository = require('./../repositories/accessToken')
const appErrors = require('./../utils/errors/app')
const configIdleTimeoutSec = require('config').get('jwt').get('idleTimeoutSec')

const configIdleTimeoutMs = configIdleTimeoutSec * 1000

module.exports = class VerifyTokenPayload extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        token: { type: 'string', required: true },
        userId: { type: ['number'], required: false, minimum: 1 },
        adminId: { type: ['number'], required: false, minimum: 1 },
        tokenIssuedAt: { type: 'number', required: true, minimum: 1 },
      },
      anyOf: [
        { required: ['userId'] },
        { required: ['adminId'] },
      ],
    }
  }

  run() {
    Promise.all([
      (() => {
        if (this.requestData.adminId) {
          return adminRepository.findById(this.requestData.adminId)
        }
        return null
      })(),
      (() => {
        if (this.requestData.userId) {
          // If admin is logged as user he is not using stored token in DB
          const requiredToken = !this.requestData.adminId
          return userRepository.findByIdAndAccessToken(this.requestData.userId, this.requestData.token, requiredToken)
            .then(user => {
              // Important 5 second tolerance to iat (token issued at)
              if (this.requestData.tokenIssuedAt + 5 < Math.floor(user.passwordLastUpdatedAt.getTime() / 1000)) {
                throw new appErrors.TokenRevokedError()
              }
              if (user && user.accessToken && user.accessToken.lastActivityAt && ((user.accessToken.lastActivityAt.getTime() + configIdleTimeoutMs) < Date.now())) {
                throw new appErrors.TokenIdleTimoutError()
              }
              if (user && user.accessToken && user.accessToken.clientRefreshReason) {
                throw new appErrors.InvalidDataError(user.accessToken.clientRefreshReason)
              }

              if (user && user.accessToken && user.accessToken.id) {
                accessTokenRepository.updateLastActivityTimeAsync(user.accessToken ? user.accessToken.id : null)
              }
              return user
            })
        }
        return null
      })(),
    ]).spread((admin, userData) => this.done(parseResponse(admin, userData))).catch(err => this.error(err))
  }
}

function parseResponse(admin, userData) {
  let user, loginTimeout, loginIdleTimeout
  if (userData) {
    loginTimeout = userData.accessToken ? userData.accessToken.expiresAt.getTime() : null
    loginIdleTimeout = userData.accessToken ? userData.accessToken.lastActivityAt.getTime() + configIdleTimeoutMs : null
    delete userData.accessToken
    user = userData
  }
  return {
    admin: admin || null,
    user: user || null,
    loginTimeout,
    loginIdleTimeout,
  }
}
