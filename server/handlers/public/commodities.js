'use strict'

const GetAllService = require('./../../services/commodity/GetAll')
const appErrors = require('./../../utils/errors/app')
const responseErrors = require('./../../utils/errors/response')
const { ok } = require('./../apiResponses')

exports.getAll = getAll

function getAll(req, res, next) {
  new GetAllService({
    request: req,
  }).execute({
    limit: req.query.limit ? parseInt(req.query.limit) : 20,
  }).then(commodities => ok(req, res, next, commodities))
    .catch(next)
}
