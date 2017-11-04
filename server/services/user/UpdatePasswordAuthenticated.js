'use strict'

const AbstractService = require('./../abstract')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/app')
const cryptoUtils = require('./../../utils/cryptoUtils')
const tokenGenerator = require('./../../utils/tokenGenerator')
const validators = require('./../../utils/validators')
const sendgridUtils = require('./../../utils/email/sendgridUtils')

module.exports = class UpdatePasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        userId: { type: 'number', required: true, minimum: 1 },
        oldPassword: validators.passwordValidator({ required: true }),
        newPassword: validators.passwordValidator({ required: true }),
      },
    }
  }

  run() {
    validators.advancePasswordValidation(this.requestData.newPassword)
    const context = {
      userId: null,
      firstName: null,
      lastName: null,
      email: null,
    }
    return userRepository.findById(this.requestData.userId)
      .then(user => {
        if (!user || !user.password) {
          throw new appErrors.NotFoundError()
        }
        context.userId = user.id
        context.firstName = user.firstName
        context.lastName = user.lastName
        context.email = user.email
        return cryptoUtils.comparePasswords(this.requestData.oldPassword, user.password)
      })
      .then(verified => {
        if (!verified) {
          throw new appErrors.PasswordsDoesNotMatchError()
        }
        return cryptoUtils.hashPassword(this.requestData.newPassword)
      })
      .then(passwordHash => userRepository.update(this.requestData.userId, {
        password: passwordHash,
        publicToken: null,
        passwordLastUpdatedAt: new Date(),
      }))
      .then(() => {
        const data = {
          fullName: `${context.firstName} ${context.lastName}`,
          toAddress: context.email,
        }
        return sendgridUtils.sendChangePasswordEmail(data)
      })
      .then(() => tokenGenerator.generateUserJwtToken({ userId: context.userId }))
      .then(token => this.done({ accessToken: token }))
      .catch(err => this.error(err))
  }
}
