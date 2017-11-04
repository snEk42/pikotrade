'use strict'

const AbstractService = require('./../abstract')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/app')
const tokenGenerator = require('./../../utils/tokenGenerator')
const sendgridUtils = require('./../../utils/email/sendgridUtils')
const validators = require('./../../utils/validators')

module.exports = class ResetPasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        email: validators.emailValidator({ required: false }),
        duplicateResetPasswordToken: { type: 'string', required: false, maxLength: 256 },
      },
      oneOf: [
        { required: ['email'] },
        { required: ['duplicateResetPasswordToken'] },
      ],
    }
  }

  run() {
    const context = {
      user: null,
      publicToken: null,
    }

    return this.findUser()
      .then(user => {
        // if (!user.confirmed) {
        //  throw new appErrors.NotConfirmedError();
        // }
        context.user = user
        context.passwordPublicToken = tokenGenerator.generateRandomToken()
        const updatePayload = {
          passwordPublicToken: context.passwordPublicToken,
        }
        if (this.requestData.duplicateResetPasswordToken) {
          updatePayload.duplicateResetPasswordToken = null
        }
        return userRepository.update(user.id, updatePayload)
      })
      .then(() => sendgridUtils.sendResetPasswordEmail({
        toAddress: context.user.email,
        resetPasswordToken: context.passwordPublicToken,
        fullName: `${context.user.firstName} ${context.user.lastName}`,
      }))
      .then(() => this.done())
      .catch(err => this.error(err))
  }

  findUser() {
    if (this.requestData.email) {
      return userRepository.findByEmail(this.requestData.email)
        .then(user => {
          if (!user) {
            throw new appErrors.NotFoundError()
          }
          return user
        })
    }
    return userRepository.findByToken(this.requestData.duplicateResetPasswordToken, { duplicateResetPasswordToken: true })
  }
}
