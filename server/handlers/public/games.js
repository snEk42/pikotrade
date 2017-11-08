'use strict'

const GetByIdService = require('./../../services/game/GetById')
const { ok } = require('./../apiResponses')

exports.getById = getById

function getById(req, res, next) {
  new GetByIdService({
    request: req,
  }).execute({
    gameId: req.params && req.params.gameId ? parseInt(req.params.gameId) : undefined,
  })
    .then(response => ok(req, res, next, response))
    .catch(next)
}
