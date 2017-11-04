'use strict'

const db = require('./../dataAccess')

exports.bulkCreate = bulkCreate

function bulkCreate(exchangeRates, dbTransaction) {
  return db.ExchangeRate.bulkCreate(exchangeRates, { transaction: dbTransaction })
}
