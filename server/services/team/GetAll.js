'use strict'

const AbstractService = require('./../abstract')
const teamRepository = require('./../../repositories/team')

module.exports = class GetAll extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  run() {
    return teamRepository.findAll()
      .then(teams => this.done(teams))
      .catch(err => this.error(err))
  }
}
