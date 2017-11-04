'use strict'

const AbstractService = require('./../abstract')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/app')
const validator = require('./../../utils/validators')
const tokenGenerator = require('./../../utils/tokenGenerator')
const cryptoUtils = require('./../../utils/cryptoUtils')

module.exports = class LoginService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        userName: validator.emailValidator({ required: true }),
        password: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  run() {
    const context = {
      user: null,
    }
    this.requestData.userName = this.requestData.userName.toLowerCase()
    return userRepository.findByEmail(this.requestData.userName)
      .then(user => {
        if (!user) {
          throw new appErrors.UnauthorizedError()
        }
        context.user = user
        return cryptoUtils.comparePasswords(this.requestData.password, context.user.password)
      })
      .then(verified => {
        if (!verified) {
          throw new appErrors.UnauthorizedError()
        }
        return tokenGenerator.generateUserJwtToken({ userId: context.user.id })
      })
      .then(token => {
        context.user.accessToken = token
        return userRepository.update(context.user.id, { lastLoginAt: new Date().toISOString() })
      })
      .then(() => this.done(context.user))
      .catch(err => this.error(err))
  }
}
