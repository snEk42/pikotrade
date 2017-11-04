'use strict'

const _ = require('lodash')

const koeficient = 0.1

const calculateProfit = (order, commodities) => {
  if (_.isNil(order) || _.isNil(commodities)) {
    throw new Error('Missing order or commodities')
  }

  const soldCommodity = commodities.find(commodity => commodity.id === order.commodityId)
  return soldCommodity ? soldCommodity.exchangeRate * order.amount : 0
}

const calculateExchangeRate = (value, median) => {
  if (_.isNil(value) || _.isNil(median)) {
    throw new Error('Missing value or median')
  }
  return median / (1 + Math.exp(value))
}

const calculateNewExchangeRates = (order, commodities) => {
  if (_.isNil(order) || _.isNil(commodities)) {
    throw new Error('Missing order or commodities')
  }
  return commodities.map(commodity => {
    const newValue = commodity.id === order.commodityId
      ? commodity.value + (koeficient * order.amount)
      : commodity.value - (koeficient * order.amount / 3)
    return {
      commodityId: commodity.id,
      time: new Date().toISOString(),
      value: newValue,
      exchangeRate: calculateExchangeRate(newValue, commodity.median),
    }
  })
}


module.exports = {
  calculateExchangeRate,
  calculateNewExchangeRates,
  calculateProfit,
}
