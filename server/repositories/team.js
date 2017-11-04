'use strict'

const db = require('./../dataAccess')
const parsers = require('./repositoryParsers')
const appErrors = require('./../utils/errors/app')

exports.findById = findById
exports.update = update

function findById(id, transaction) {
  const findOptions = { transaction }
  return db.Team.findById(id, findOptions)
    .then(team => {
      if (!team) {
        throw new appErrors.NotFoundError()
      }
      return parsers.parseTeam(team)
    })
}

function update(id, values, transaction) {
  if (!id || isNaN(id)) {
    throw new Error('Parameter \'id\' is mandatory and required number type.')
  }
  return db.Team.update(values, {
    where: { id },
    transaction,
  })
    .then(results => {
      if (results[1] === 0) {
        throw new appErrors.NotFoundError()
      }
      return db.Team.findById(id)
    })
    .then(updatedTeam => parsers.parseTeam(updatedTeam))
}
