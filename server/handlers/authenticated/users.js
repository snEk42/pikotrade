'use strict'

const UpdatePasswordAuthenticatedService = require('./../../services/user/UpdatePasswordAuthenticated')
const UpdatePersonalInfoService = require('./../../services/user/UpdatePersonalInfo')
const ResendConfirmEmailService = require('./../../services/user/ResendConfirmEmail')
const GetUsersPersonalInfo = require('./../../services/user/GetUsersPersonalInfo')
const appErrors = require('./../../utils/errors/app')
const responseErrors = require('./../../utils/errors/response')

exports.updatePersonalInfo = updatePersonalInfo
exports.getPersonalInfo = getPersonalInfo
exports.updatePasswordAuthenticated = updatePasswordAuthenticated
exports.resendConfirmEmail = resendConfirmEmail

function updatePersonalInfo(req, res, next) {
  new UpdatePersonalInfoService().execute({
    userId: req.user.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }).then(() => res.status(200).end())
    .catch(appErrors.NotFoundError, () => next(new responseErrors.NotFoundError()))
    .catch(appErrors.AccountSubtypeStateRegulation, err => next(new responseErrors.ConflictError(err.message)))
    .catch(appErrors.InvalidStateError, () => next(new responseErrors.BadRequestError('Provided state is not allowed.')))
    .catch(next)
}

function getPersonalInfo(req, res, next) {
  return new GetUsersPersonalInfo().execute({
    userId: req.user.id,
  }).then(personalInfo => {
    delete personalInfo.password
    return res.json(personalInfo)
  })
    .catch(appErrors.NotFoundError, () => next(new responseErrors.NotFoundError()))
    .catch(next)
}

function updatePasswordAuthenticated(req, res, next) {
  return new UpdatePasswordAuthenticatedService().execute({
    userId: req.user.id,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  }).then(response => res.status(200).json(response))
    .catch(appErrors.NotFoundError, () => next(new responseErrors.NotFoundError()))
    .catch(appErrors.PasswordWrongFormat, () => next(new responseErrors.WrongPasswordFormat()))
    .catch(appErrors.PasswordsDoesNotMatchError, () => next(new responseErrors.BadRequestError('Old password does not match actual user password')))
    .catch(next)
}

function resendConfirmEmail(req, res, next) {
  return new ResendConfirmEmailService().execute({
    id: req.user.id,
    publicToken: req.user.publicToken,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    confirmed: req.user.confirmed,
  }).then(() => res.status(200).end())
    .catch(appErrors.NotFoundError, () => next(new responseErrors.NotFoundError()))
    .catch(next)
}
