'use strict'

const db = require('./../dataAccess')
const appErrors = require('./../utils/errors/app')
const parsers = require('./repositoryParsers')

function findById(id, transaction) {
  return db.Admin.findById(id, {
    include: [{
      model: db.Role, as: 'role',
    }],
    transaction,
  }).then(admin => {
    if (!admin) {
      throw new appErrors.NotFoundError()
    }
    return parsers.parseAdmin(admin)
  })
}

function findByUserName(userName) {
  return db.Admin.findOne({
    where: { userName },
    include: [{
      model: db.Role, as: 'role',
    }],
  }).then(admin => {
    if (!admin) {
      throw new appErrors.NotFoundError()
    }
    return parsers.parseAdmin(admin)
  })
}

module.exports = {
  findById,
  findByUserName,
}
