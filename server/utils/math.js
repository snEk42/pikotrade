'use strict'

const enums = require('../../common/enums')
const _ = require('lodash')

const koeficient = 0.05

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
      ? commodity.value + (koeficient * order.amount / getCommodityWeight(commodity))
      : commodity.value - (koeficient * order.amount / 3 / getCommodityWeight(commodity))
    return {
      commodityId: commodity.id,
      index: commodity.index + 1,
      time: new Date().toISOString(),
      value: newValue,
      exchangeRate: calculateExchangeRate(newValue, commodity.median),
    }
  })
}

function getCommodityWeight(commodity) {
  switch (commodity.id) {
    case enums.COMMODITIES.DIAMONDS.id:
      return 3
    case enums.COMMODITIES.WOOD.id:
    case enums.COMMODITIES.ROCK.id:
      return 2
    default:
      return 1
  }
}


module.exports = {
  calculateExchangeRate,
  calculateNewExchangeRates,
  calculateProfit,
}
