'use strict'

const db = require('./../dataAccess')
const parsers = require('./repositoryParsers')

function create(userId, token, expiresAt, issuedAt, transaction) {
  console.log(userId, token, expiresAt, issuedAt)
  if (!userId || !token || !expiresAt || !issuedAt) {
    throw new Error('Missing mandatory data when creating token')
  }
  return db.AccessToken.create({
    token,
    userId,
    expiresAt,
    issuedAt,
    lastActivityAt: Date.now(),
  }, { transaction })
    .then(createdToken => parsers.parseAccessToken(createdToken))
}

function updateLastActivityTimeAsync(id) {
  if (!id) {
    throw new Error('Missing token id when updating token last activity')
  }
  return db.AccessToken.update({ lastActivityAt: Date.now() }, { where: { id } })
}

module.exports = {
  create,
  updateLastActivityTimeAsync,
}
