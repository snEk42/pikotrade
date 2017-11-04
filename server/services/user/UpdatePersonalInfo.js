'use strict'

const userRepository = require('./../../repositories/user')
const TransactionalService = require('./../TransactionalService')

module.exports = class UpdatePersonalInfo extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        userId: { type: 'number', required: true, minimum: 1 },
        firstName: { type: 'string', required: true, minLength: 1, maxLength: 40 },
        lastName: { type: 'string', required: true, minLength: 1, maxLength: 80 },
      },
    }
  }

  run() {
    return this.createOrGetTransaction()
      .then(() => userRepository.findById(this.requestData.userId, this.getExistingTransaction()))
      .then(() => {
        const userUpdateData = {
          firstName: this.requestData.firstName,
          lastName: this.requestData.lastName,
        }
        return userRepository.update(this.requestData.userId, userUpdateData, this.getExistingTransaction())
      })
      .then(() => this.done())
      .catch(err => this.error(err))
  }
}
