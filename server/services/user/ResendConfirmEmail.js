'use strict'

const TransactionalService = require('./../TransactionalService')
const userRepository = require('./../../repositories/user')
const tokenGenerator = require('./../../utils/tokenGenerator')
const validators = require('../../utils/validators')
const sendgridUtils = require('./../../utils/email/sendgridUtils')

module.exports = class ResendConfirmEmailService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        id: { type: 'number', required: true, minimum: 1 },
        publicToken: { type: 'string,null', required: false },
        email: validators.emailValidator({ required: true }),
        firstName: validators.validateName({ required: true, maxLength: 40 }),
        lastName: validators.validateName({ required: true, maxLength: 80 }),
        confirmed: { type: 'boolean', required: false },
      },
    }
  }

  run() {
    const context = {
      user: this.requestData,
    }
    return this.createOrGetTransaction()
      .then(() => this.sendConfirmationEmail(context, this, this.requestData.userLanguage))
  }

  sendConfirmationEmail(context, that) {
    if (context.user.confirmed) {
      return this.done(context.user)
    }
    if (!context.user.publicToken) {
      const publicToken = tokenGenerator.generateRandomToken()
      context.user.publicToken = publicToken
      return userRepository.update(context.user.id, { publicToken }, that.getExistingTransaction())
        .then(() => sendgridUtils.sendInviteEmail({
          fromReitId: context.fromReitId,
          toAddress: context.user.email,
          confirmToken: context.user.publicToken,
          fullName: `${validators.formatName(context.user.firstName)} ${validators.formatName(context.user.lastName)}`,
        }))
        .then(() => this.done(context.user))
        .catch(err => this.error(err))
    }
    return sendgridUtils.sendInviteEmail({
      fromReitId: context.fromReitId,
      toAddress: context.user.email,
      confirmToken: context.user.publicToken,
      fullName: `${validators.formatName(context.user.firstName)} ${validators.formatName(context.user.lastName)}`,
    })
      .then(() => this.done(context.user))
      .catch(err => this.error(err))
  }
}
