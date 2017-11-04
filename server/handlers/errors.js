'use strict'

const responseErrors = require('./../utils/errors/response')
const appErrors = require('./../utils/errors/app')
const { errorLogger } = require('./../utils/logger')

function handleNotFound(req, res, next) {
  next(new responseErrors.NotFoundError())
}

function handleErrors(err, req, res) {
  if (err instanceof appErrors.ValidationError) {
    err = new responseErrors.BadRequestError(err.message, err.errors)
  }

  if (err instanceof appErrors.UnauthorizedRoleError) {
    err = new responseErrors.UnauthorizedError()
  }

  if (!(err instanceof responseErrors.ResponseError)) {
    errorLogger.error(err)
    err = new responseErrors.InternalServerError()
  }
  const response = { type: err.type, message: err.message }
  if (process.env.NODE_ENV === 'development' && err.description) {
    response.description = err.description
  }
  console.log('FUCK')
  res.status(err.status).json(response)
}

module.exports = {
  handleNotFound,
  handleErrors,
}
