'use strict'

const SellCommodityService = require('./../../services/commodity/Sell')
const appErrors = require('./../../utils/errors/app')
const responseErrors = require('./../../utils/errors/response')
const { ok } = require('./../apiResponses')

exports.sell = sell

function sell(req, res, next) {
  new SellCommodityService({
    request: req,
  }).execute({
    teamId: req.body.teamId,
    commodityId: req.body.commodityId,
    amount: req.body.amount,
  }).then(response => ok(req, res, next, response))
    .catch(next)
}
