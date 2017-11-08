'use strict'

const db = require('./../dataAccess')
const parsers = require('./repositoryParsers')
const appErrors = require('./../utils/errors/app')

exports.findById = findById

function findById(id, transaction) {
  const findOptions = { transaction }
  return db.Game.findById(id, findOptions)
    .then(game => {
      if (!game) {
        throw new appErrors.NotFoundError()
      }
      return parsers.parseGame(game)
    })
}
