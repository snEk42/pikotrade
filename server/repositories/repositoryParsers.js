'use strict'

const _ = require('lodash')
const { calculateExchangeRate } = require('../utils/math')

function parseAccessToken(accessToken) {
  if (!accessToken) {
    return null
  }
  const parsedToken = {}
  parsedToken.id = accessToken.id
  parsedToken.token = accessToken.token
  parsedToken.issuedAt = accessToken.issuedAt
  parsedToken.expiresAt = accessToken.expiresAt
  parsedToken.lastActivityAt = accessToken.lastActivityAt
  return parsedToken
}

function parseAdmin(admin) {
  if (!admin) {
    return admin
  }
  const parsedAdmin = {}
  parsedAdmin.id = admin.id
  parsedAdmin.userName = admin.userName
  parsedAdmin.password = admin.password
  parsedAdmin.disabled = admin.disabled
  return parsedAdmin
}

function parseTeam(team) {
  if (!team) {
    return team
  }
  const parsedTeam = {}
  parsedTeam.id = team.id
  parsedTeam.name = team.name
  parsedTeam.score = team.score
  parsedTeam.arrived = team.arrived
  parsedTeam.room = team.room
  parsedTeam.site = team.site
  return parsedTeam
}

function parseTeams(teams) {
  return teams ? _.map(teams, parseTeam) : teams
}

function parseUser(user) {
  if (!user) {
    return null
  }
  const parsedUser = {}
  parsedUser.id = user.id
  parsedUser.password = user.password
  parsedUser.email = user.email
  parsedUser.firstName = user.firstName
  parsedUser.lastName = user.lastName
  parsedUser.publicToken = user.publicToken
  parsedUser.passwordPublicToken = user.passwordPublicToken
  parsedUser.passwordLastUpdatedAt = user.passwordLastUpdatedAt ? user.passwordLastUpdatedAt : undefined
  parsedUser.confirmed = user.confirmed
  parsedUser.createdAt = user.createdAt
  parsedUser.updatedAt = user.updatedAt

  if (user.accessTokens && user.accessTokens.length > 0) {
    parsedUser.accessToken = parseAccessToken(user.accessTokens[0])
  }
  return parsedUser
}

function parseUsers(users) {
  return users ? _.map(users, parseUser) : users
}

function parseCommodity(commodity) {
  if (!commodity) {
    return null
  }
  const parsedCommodity = {}
  parsedCommodity.id = commodity.id
  parsedCommodity.name = commodity.name
  parsedCommodity.median = commodity.median

  if (commodity.exchangeRates && commodity.exchangeRates.length > 0) {
    parsedCommodity.value = commodity.exchangeRates[0].value
    parsedCommodity.index = commodity.exchangeRates[0].index
    parsedCommodity.exchangeRate = commodity.exchangeRates[0].exchangeRate
    parsedCommodity.data = parseData(commodity.exchangeRates)
  } else {
    parsedCommodity.value = 0
    parsedCommodity.index = 0
    parsedCommodity.exchangeRate = calculateExchangeRate(0, commodity.median)
    parsedCommodity.data = [{ x: parsedCommodity.index, y: parsedCommodity.exchangeRate }]
  }

  return parsedCommodity
}

function parseCommodities(commodities) {
  return commodities ? _.map(commodities, parseCommodity) : commodities
}

function parseData(exchangeRates) {
  return exchangeRates.map(rate => ({
    x: rate.index,
    y: rate.exchangeRate,
  }))
}

function parseGame(game) {
  if (!game) {
    return game
  }
  const parsedGame = {}
  parsedGame.id = game.id
  parsedGame.start = game.start
  parsedGame.end = game.end
  return parsedGame
}

module.exports = {
  parseAccessToken,
  parseAdmin,
  parseUsers,
  parseUser,
  parseTeams,
  parseTeam,
  parseCommodities,
  parseCommodity,
  parseGame,
}
