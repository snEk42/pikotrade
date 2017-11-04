'use strict'

const AbstractService = require('./../abstract')
const userRepository = require('./../../repositories/user')
const cryptoUtils = require('./../../utils/cryptoUtils')
const validators = require('./../../utils/validators')
const sendgridUtils = require('./../../utils/email/sendgridUtils')

module.exports = class UpdatePasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        password: validators.passwordValidator({ required: true }),
        token: { type: 'string', required: true, maxLength: 256 },
      },
    }
  }

  run() {
    const context = {
      userId: null,
    }
    validators.advancePasswordValidation(this.requestData.password)
    return userRepository.findByToken(this.requestData.token, { passwordToken: true })
      .then(user => {
        // if (!user.confirmed) {
        //  throw new appErrors.NotConfirmedError();
        // }
        if (!user.id || !user.firstName || !user.lastName || !user.email) {
          throw new Error('Expecting parameters \'id\', \'firstName\', \'lastName\', \'email\'.')
        }
        context.userId = user.id
        context.firstName = user.firstName
        context.lastName = user.lastName
        context.email = user.email
        return cryptoUtils.hashPassword(this.requestData.password)
      })
      .then(passwordHash => userRepository.update(context.userId, {
        password: passwordHash,
        passwordPublicToken: null,
        passwordLastUpdatedAt: new Date().toISOString(),
      }))
      .then(() => {
        const data = {
          fullName: `${context.firstName} ${context.lastName}`,
          toAddress: context.email,
        }
        return sendgridUtils.sendChangePasswordEmail(data)
      })
      .then(() => this.done())
      .catch(err => this.error(err))
  }
}
