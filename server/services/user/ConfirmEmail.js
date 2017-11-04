'use strict'

const AbstractService = require('./../abstract')
const userRepository = require('./../../repositories/user')
const tokenGenerator = require('./../../utils/tokenGenerator')

module.exports = class ConfirmEmailService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        confirmToken: { type: 'string', required: true, maxLength: 256 },
      },
    }
  }

  run() {
    const context = {
      user: null,
    }
    return userRepository.findByToken(this.requestData.confirmToken)
      .then(user => {
        context.user = user
        return userRepository.update(user.id, {
          publicToken: null,
          confirmed: true,
          lastLoginAt: new Date().toISOString(),
        })
      })
      .then(() => tokenGenerator.generateUserJwtToken({ userId: context.user.id }))
      .then(token => {
        context.user.accessToken = token
        return this.done(context.user)
      })
      .catch(err => this.error(err))
  }
}
