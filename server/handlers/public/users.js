'use strict'

const LoginService = require('./../../services/user/Login')
const SignUpService = require('./../../services/user/SignUp')
const ConfirmEmailService = require('./../../services/user/ConfirmEmail')
const ResetPasswordService = require('./../../services/user/ResetPassword')
const UpdatePasswordService = require('./../../services/user/UpdatePassword')
const appErrors = require('./../../utils/errors/app')
const responseErrors = require('./../../utils/errors/response')
const responseParsers = require('./../responseParsers')
const { ok, created } = require('./../apiResponses')

exports.login = login
exports.signUp = signUp
exports.confirmEmail = confirmEmail
exports.resetPassword = resetPassword
exports.updatePassword = updatePassword

function updatePassword(req, res, next) {
  new UpdatePasswordService({
    request: req,
  }).execute({
    token: req.body.token,
    password: req.body.password,
  }).then(() => ok(req, res, next))
    .catch(appErrors.InvalidTokenError, () => next(new responseErrors.ForbiddenError('api.errors.account.tokenNoLongerValid')))
    .catch(appErrors.PasswordWrongFormat, () => next(new responseErrors.WrongPasswordFormat()))
    .catch(appErrors.NotConfirmedError, () => next(new responseErrors.UnauthorizedError('api.errors.user.emailNotVerified')))
    .catch(next)
}

function resetPassword(req, res, next) {
  new ResetPasswordService({
    request: req,
  }).execute({
    email: req.body.email,
    duplicateResetPasswordToken: req.body.duplicateResetPasswordToken,
  }).then(() => ok(req, res, next))
    .catch(appErrors.NotFoundError, () => next(new responseErrors.NotFoundError('api.errors.user.emailNotExist')))
    .catch(appErrors.NotConfirmedError, () => next(new responseErrors.UnauthorizedError('api.errors.user.emailNotVerified')))
    .catch(appErrors.InvalidTokenError, () => next(new responseErrors.ForbiddenError('api.errors.user.actionNotValid')))
    .catch(next)
}

function confirmEmail(req, res, next) {
  new ConfirmEmailService({
    request: req,
  }).execute({
    confirmToken: req.body.token,
  }).then(user => {
    const response = responseParsers.userForLogin(user)
    return ok(req, res, next, response)
  })
    .catch(appErrors.InvalidTokenError, () => next(new responseErrors.ForbiddenError('api.errors.user.linkExpired')))
    .catch(next)
}

function login(req, res, next) {
  new LoginService({
    request: req,
  }).execute({
    userName: req.body.userName,
    password: req.body.password,
  }).then(user => {
    const response = responseParsers.userForLogin(user)
    return ok(req, res, next, response)
  })
    .catch(appErrors.NotConfirmedError, () => next(new responseErrors.UnauthorizedError('api.errors.user.emailNotVerified')))
    .catch(appErrors.UnauthorizedError, appErrors.ValidationError, () => next(new responseErrors.UnauthorizedError('api.errors.account.invalidCredentials')))
    .catch(next)
}

function signUp(req, res, next) {
  new SignUpService({
    request: req,
  }).execute({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  }).then(resp => {
    if (resp instanceof Error) {
      throw resp
    }
    return created(req, res, next, responseParsers.userForLogin(resp))
  })
    .catch(appErrors.PasswordWrongFormat, () => next(new responseErrors.WrongPasswordFormat()))
    .catch(appErrors.UserPotentialyExistsError, err => next(new responseErrors.ConflictError({
      duplicate: true,
      emailExists: err.emailExists,
      duplicateResetPasswordToken: err.duplicateResetPasswordToken,
    })))
    .catch(next)
}
