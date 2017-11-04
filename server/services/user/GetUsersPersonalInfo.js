'use strict'

const AbstractService = require('./../abstract')
const userRepository = require('./../../repositories/user')

module.exports = class GetUsersPersonalInfo extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        userId: { type: 'number', required: true, minimum: 1 },
      },
    }
  }

  run() {
    return userRepository.getPersonalInfo(this.requestData.userId)
      .then(personalInfo => this.done(personalInfo))
      .catch(err => this.error(err))
  }
}
