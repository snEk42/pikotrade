'use strict'

const AbstractService = require('./../abstract')
const commodityRepository = require('./../../repositories/commodity')
const _ = require('lodash')

module.exports = class GetAll extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        limit: { type: 'number', required: true, minimum: 1 },
      },
    }
  }

  run() {
    return commodityRepository.findAll(this.requestData.limit)
      .then(commodities => reorderData(commodities))
      .then(commodities => this.done(commodities))
      .catch(err => this.error(err))
  }
}

function reorderData(commodities) {
  return commodities.map(commodity => {
    commodity.data = _.reverse(commodity.data)
    return commodity
  })
}
