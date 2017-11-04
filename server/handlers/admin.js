'use strict'

const AdminLoginService = require('../services/admin/Login')
const appErrors = require('../utils/errors/app')
const responseErrors = require('../utils/errors/response')

function login(req, res, next) {
  const returnError = () => next(new responseErrors.UnauthorizedError('Invalid credentials.'))
  new AdminLoginService()
    .execute({
      userName: req.body.userName,
      password: req.body.password,
    })
    .then(admin => res.json(admin))
    .catch(appErrors.UnauthorizedError, appErrors.NotFoundError, returnError)
    .catch(next)
}

module.exports = { login }
