'use strict'

const TransactionalService = require('./../TransactionalService')
const teamRepository = require('./../../repositories/team')
const Promise = require('bluebird')

module.exports = class IncrementScore extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'number', required: true, minimum: 1 },
        scoreChange: { type: 'number', required: true },
      },
    }
  }

  run() {
    const context = {
      team: null,
      scoreChange: this.requestData.scoreChange,
    }
    return this.createOrGetTransaction()
      .then(() => teamRepository.findById(this.requestData.teamId, this.getExistingTransaction()))
      .then(team => {
        context.team = team
        return teamRepository.update(team.id, { score: team.score + context.scoreChange }, this.getExistingTransaction())
      })
      .then(() => this.done({
        teamId: context.team.id,
        teamName: context.team.name,
        oldScore: context.team.score,
        newScore: context.team.score + context.scoreChange,
        scoreChange: context.scoreChange,
      }))
      .catch(err => this.error(err))
  }
}
