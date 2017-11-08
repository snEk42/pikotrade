'use strict'

const IncrementScoreService = require('./../../services/team/IncrementScore')
const { ok } = require('./../apiResponses')

exports.incrementScore = incrementScore

function incrementScore(req, res, next) {
  new IncrementScoreService({
    request: req,
  }).execute({
    teamId: req.body.teamId,
    scoreChange: req.body.scoreChange,
  })
    .then(response => ok(req, res, next, response))
    .catch(next)
}
