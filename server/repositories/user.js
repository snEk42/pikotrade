'use strict'

const db = require('./../dataAccess')
const parsers = require('./repositoryParsers')
const appErrors = require('./../utils/errors/app')

exports.create = create
exports.count = count
exports.findByEmail = findByEmail
exports.findById = findById
exports.findByIdAndAccessToken = findByIdAndAccessToken
exports.getPersonalInfo = getPersonalInfo
exports.findByToken = findByToken
exports.update = update
exports.findAllWithFilter = findAllWithFilter
exports.findAllById = findAllById
exports.changeEmail = changeEmail

function create(user, dbTransaction) {
  return db.User.create(user, { transaction: dbTransaction }).then(createdUser => parsers.parseUser(createdUser))
}

function count() {
  return db.User.count()
}

function findByEmail(email, dbTransaction) {
  return db.User.findOne({
    where: db.sequelize.where(db.sequelize.fn('lower', db.sequelize.col('email')), db.sequelize.fn('lower', email)),
    transaction: dbTransaction,
  }).then(user => parsers.parseUser(user))
}

function findById(id, transaction) {
  const findOptions = { transaction }
  return db.User.findById(id, findOptions)
    .then(user => {
      if (!user) {
        throw new appErrors.NotFoundError()
      }
      return parsers.parseUser(user)
    })
}

function findByIdAndAccessToken(id, token, requiredToken, transaction) {
  if (!id || !token || typeof requiredToken !== 'boolean') {
    throw new Error('Missing userId or token in findByIdAndToken')
  }
  return db.User.findById(id, {
    include: [{
      model: db.AccessToken,
      as: 'accessTokens',
      required: requiredToken,
      where: {
        token,
      },
    }],
    transaction,
  })
    .then(user => {
      if (!user) {
        throw new appErrors.NotFoundError()
      }
      return parsers.parseUser(user)
    })
}

function getPersonalInfo(id) {
  return db.User.findById(id, {
    attributes: { exclude: ['password', 'publicToken', 'passwordPublicToken', 'passwordLastUpdatedAt'] },
  }).then(user => {
    if (!user) {
      throw new appErrors.NotFoundError()
    }
    return parsers.parseUser(user)
  })
}

function findByToken(token, options) {
  const findOptions = {}

  if (options && options.passwordToken) {
    findOptions.where = { passwordPublicToken: token }
  } else if (options && options.duplicateResetPasswordToken) {
    findOptions.where = { duplicateResetPasswordToken: token }
  } else {
    findOptions.where = { publicToken: token }
  }
  return db.User.findOne(findOptions).then(user => {
    if (!user) {
      throw new appErrors.InvalidTokenError()
    }
    return parsers.parseUser(user)
  })
}

function update(id, values, transaction) {
  if (!id || isNaN(id)) {
    throw new Error('Parameter \'id\' is mandatory and required number type.')
  }
  return db.User.update(values, {
    where: { id },
    returning: true,
    transaction,
  })
    .then(results => {
      if (results[1] === 0) {
        throw new appErrors.NotFoundError()
      }
      return db.User.findById(id)
    })
    .then(updatedUser => parsers.parseUser(updatedUser))
}

function findAllWithFilter(filter, offset, limit) {
  const query = {
    offset,
    limit,
    attributes: { exclude: ['password', 'passwordPublicToken', 'publicToken'] },
    order: [['createdAt', 'DESC']],
  }
  const userWhere = {}
  if (filter.user.firstName) {
    userWhere.firstName = { $ilike: `%${filter.user.firstName}%` }
  }
  if (filter.user.lastName) {
    userWhere.lastName = { $ilike: `%${filter.user.lastName}%` }
  }
  if (filter.user.email) {
    userWhere.email = { $ilike: `%${filter.user.email}%` }
  }
  if (filter.user.id) {
    userWhere.id = filter.user.id
  }
  query.where = userWhere

  return db.User.findAll(query)
    .then(users => parsers.parseUsers(users))
}

function findAllById(userId) {
  return db.User.findById(userId, {
    attributes: { exclude: ['password', 'publicToken', 'passwordPublicToken', 'passwordLastUpdatedAt'] },
  }).then(user => parsers.parseUser(user))
}

function changeEmail(userId, email, dbTransaction) {
  return db.User.update({ email }, {
    where: { id: userId },
    transaction: dbTransaction,
    returning: true,
  }).then(user => parsers.parseUser(user))
}
