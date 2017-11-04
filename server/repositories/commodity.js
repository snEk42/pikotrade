'use strict'

const db = require('./../dataAccess')
const appErrors = require('./../utils/errors/app')
const parsers = require('./repositoryParsers')

function findById(id, transaction) {
  return db.Commodity.findById(id, {
    include: [{
      model: db.ExchangeRate, as: 'exchangeRates',
    }],
    transaction,
  }).then(admin => {
    if (!admin) {
      throw new appErrors.NotFoundError()
    }
    return parsers.parseAdmin(admin)
  })
}

function findAll(exchangeRateLimit, dbTransaction) {
  return db.Commodity.findAll({
    include: [{
      model: db.ExchangeRate, as: 'exchangeRates',
      required: false,
      order: [['time', 'DESC']],
      limit: exchangeRateLimit,
    }],
    transaction: dbTransaction,
  }).then(commodities => {
    if (!commodities) {
      throw new appErrors.NotFoundError()
    }
    return parsers.parseCommodities(commodities)
  })
}

module.exports = {
  findById,
  findAll,
}
