'use strict'

const TransactionalService = require('./../TransactionalService')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/app')
const cryptoUtils = require('./../../utils/cryptoUtils')
const tokenGenerator = require('./../../utils/tokenGenerator')
const sendgridUtils = require('./../../utils/email/sendgridUtils')
const validators = require('./../../utils/validators')

module.exports = class SignUpService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        firstName: validators.validateName({ required: true, maxLength: 40 }),
        lastName: validators.validateName({ required: true, maxLength: 80 }),
        password: validators.passwordValidator({ required: true }),
        email: validators.emailValidator({ required: true }),
      },
    }
  }

  run() {
    const context = {
      newUser: null,
      createdUser: null,
    }
    return this.createOrGetTransaction()
      .then(() => {
        validators.advancePasswordValidation(this.requestData.password)
        context.newUser = parseUserFromRequest(this.requestData)
        return userRepository.findByEmail(context.newUser.email, this.getExistingTransaction())
      })
      .then(user => handleExistingUser(user, true, this.getExistingTransaction()))
      .then(() => cryptoUtils.hashPassword(this.requestData.password))
      .then(password => {
        context.newUser.password = password
        context.newUser.publicToken = tokenGenerator.generateRandomToken()
        context.newUser.lastLoginAt = new Date().toISOString()

        return userRepository.create(context.newUser, this.getExistingTransaction())
      })
      .then(user => {
        context.createdUser = user
        return sendgridUtils.sendInviteEmail({
          toAddress: context.createdUser.email,
          confirmToken: context.createdUser.publicToken,
          fullName: `${context.createdUser.firstName} ${context.createdUser.lastName}`,
        })
      })
      .then(() => tokenGenerator.generateUserJwtToken({ userId: context.createdUser.id }, this.getExistingTransaction()))
      .then(token => {
        context.createdUser.accessToken = token
        return this.done(context.createdUser)
      })
      .catch(appErrors.UserPotentialyExistsError, err => this.done(err))
      .catch(err => this.error(err))
  }
}

function handleExistingUser(user, foundByEmail, transaction) {
  if (user) {
    const token = tokenGenerator.generateRandomToken()
    return userRepository.update(user.id, { duplicateResetPasswordToken: token }, transaction)
      .then(() => {
        throw new appErrors.UserPotentialyExistsError(token, foundByEmail)
      })
  }
}

function parseUserFromRequest(data) {
  return {
    firstName: validators.formatName(data.firstName),
    lastName: validators.formatName(data.lastName),
    email: data.email.toLowerCase(),
  }
}
