'use strict'

const request = require('request-promise')
const Promise = require('bluebird')

function getRandomCommodityId() {
  const randomness = getRandomInt(1, 9)
  if (randomness < 4) {
    return 1
  }
  if (randomness < 6) {
    return 2
  }
  if (randomness < 8) {
    return 3
  }
  return 4
}

function getRandomAmount() {
  return getRandomInt(1, 5)
}


// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}


async function requestGenerator() {
  const options = {
    method: 'PUT',
    url: 'https://pikotrade-staging.herokuapp.com/api/auth/commodities/sell',
    headers:
    { 'postman-token': '299bf832-693e-c607-72ed-cae091a9707d',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImhhc2giOiJhMDIzMjJiMTc3YWQzMjczNTQ5YTQ4NDNhYTMxNTNlMzE3MWE0MjkzMjJhYTI0ODRmODlkNTE1YTEzMzY1MmE0IiwiaWF0IjoxNTEwMDA2MjA5LCJleHAiOjE1MTAwMjQyMDl9.4Cq2-W1auqam3UEyLX-8nUzjcskVEjz9wbdgn2VjC4g' },
    body: { teamId: 1, commodityId: 4, amount: 2 },
    json: true,
  }
  while (true) {
    options.body.commodityId = getRandomCommodityId()
    options.body.amount = getRandomAmount()
    await request(options)
      .then(body => {
        console.log(body)
      })
    await Promise.delay(1000)
  }
} // .then(() => console.log('Done'))

return requestGenerator()
