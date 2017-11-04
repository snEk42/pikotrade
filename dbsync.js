'use strict'

require('dotenv').load({ silent: true })

const db = require('./server/dataAccess')
const enums = require('./common/enums')
const { calculateExchangeRate } = require('./server/utils/math')

let force = false

// Sync DB
if (process.env.NODE_APP_INSTANCE === 'live') {
  force = false
}

if (!process.env.DEVELOPMENT_SCRIPT) {
  throw new Error('Cant run without DEVELOPMENT_SCRIPT env')
}
db.sequelize.sync({ force })
  .then(() => db.sequelize.transaction({ autocommit: false }, dbTransaction => insertCommodities(dbTransaction).then(() => insertInitialExchangeRates(dbTransaction))))
  .then(() => {
    console.log('DB is synced.')
    return process.exit(0)
  })
  .catch(err => {
    console.error(err)
    return process.exit(1)
  })


function insertInitialExchangeRates(dbTransaction) {
  const exchangeRates = []
  for (const key in enums.COMMODITIES) {
    if (enums.COMMODITIES.hasOwnProperty(key)) {
      if (!enums.COMMODITIES[key] || !enums.COMMODITIES[key].id || !enums.COMMODITIES[key].name) {
        continue
      }
      exchangeRates.push({
        commodityId: enums.COMMODITIES[key].id,
        time: new Date().toISOString(),
        value: 0,
        exchangeRate: calculateExchangeRate(0, enums.COMMODITIES[key].median),
      })
    }
  }
  return db.ExchangeRate.bulkCreate(exchangeRates, { transaction: dbTransaction })
}

function insertCommodities(dbTransaction) {
  const commodities = createIdNameData(enums.COMMODITIES)
  return db.Commodity.bulkCreate(commodities, { transaction: dbTransaction })
}

function createIdNameData(ENUM) {
  const data = []
  for (const key in ENUM) {
    if (ENUM.hasOwnProperty(key)) {
      if (!ENUM[key] || !ENUM[key].id || !ENUM[key].name) {
        continue
      }
      const temp = {
        id: ENUM[key].id,
        name: ENUM[key].name,
      }
      if (ENUM[key].median) {
        temp.median = ENUM[key].median
      }
      data.push(temp)
    }
  }
  return data
}
