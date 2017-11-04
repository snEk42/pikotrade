'use strict'

const TransactionalService = require('./../TransactionalService')
const commodityRepository = require('./../../repositories/commodity')
const exchangeRateRepository = require('./../../repositories/exchangeRate')
const teamRepository = require('./../../repositories/team')
const enums = require('../../../common/enums')
const { calculateProfit, calculateNewExchangeRates } = require('../../utils/math')
const { publishExchangeRateChange } = require('./../../sockets/publish')
const Promise = require('bluebird')

module.exports = class Sell extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'number', required: true, minimum: 1 },
        commodityId: { type: 'number', required: true, enum: enums.COMMODITIES.idsAsEnum },
        amount: { type: 'number', required: true, minimum: 1, maximum: 30 },
      },
    }
  }

  run() {
    const context = {
      team: null,
      commodities: null,
      order: {
        commodityId: this.requestData.commodityId,
        amount: this.requestData.amount,
      },
      profit: 0,
      exchangeRates: [],
    }
    return this.createOrGetTransaction()
      .then(() => Promise.all([
        teamRepository.findById(this.requestData.teamId, this.getExistingTransaction()),
        commodityRepository.findAll(1, this.getExistingTransaction()),
      ])).spread((team, commodities) => {
        context.team = team
        context.commodities = commodities
        context.profit = calculateProfit(context.order, context.commodities)
        context.exchangeRates = calculateNewExchangeRates(context.order, context.commodities)
        return Promise.all([
          teamRepository.update(context.team.id, { worth: context.team.worth + context.profit }, this.getExistingTransaction()),
          exchangeRateRepository.bulkCreate(context.exchangeRates, this.getExistingTransaction()),
        ])
      })
      .then(() => publishExchangeRateChange(context.exchangeRates))
      .then(() => this.done({ teamId: context.team.id, teamName: context.team.name, profit: context.profit }))
      .catch(err => this.error(err))
  }
}
