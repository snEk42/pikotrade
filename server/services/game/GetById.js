'use strict'

const AbstractService = require('../abstract')
const gameRepository = require('../../repositories/game')

module.exports = class GetById extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        gameId: { type: 'integer', required: true },
      },
    }
  }

  run() {
    return gameRepository.findById(this.requestData.gameId)
      .then(game => this.done(game))
      .catch(err => this.error(err))
  }
}
