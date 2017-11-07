'use strict'

const { Router } = require('express')
const users = require('../handlers/public/users')
const commodities = require('../handlers/public/commodities')
const teams = require('../handlers/public/teams')

const router = new Router()

/**
 * @api {post} /api/admin-access-token Login admin
 * @apiName LoginAdmin
 * @apiGroup Admin
 *
 * @apiParam {String{1..256}}   userName            Admin username to verify.
 * @apiParam {String{1..256}}   password            Admin password to verify.
 *
 * @apiSuccess {Number}         id                  Admin unique identifier.
 * @apiSuccess {String}         accessToken         Server issued access token.
 *
 * @apiUse BadRequestError
 * @apiUse UnauthorizedError
 *
 */
// router.post('/admin-access-token', users.adminLogin)

/**
 * @api {post} /api/access-token Login user
 * @apiName LoginUser
 * @apiGroup Users
 *
 * @apiParam {String{1..256}}   userName            User username to verify.
 * @apiParam {String{1..256}}   password            User password to verify.
 *
 * @apiSuccess {Number}         id                  User unique identifier.
 * @apiSuccess {String}         firstName           User first name.
 * @apiSuccess {String}         lastName            User last name.
 * @apiSuccess {Boolean}        confirmed           User has confirmed email.
 * @apiSuccess {String}         accessToken         Server issued access token.
 *
 * @apiUse BadRequestError
 * @apiUse UnauthorizedError
 *
 */
router.post('/access-token', users.login)

/**
 * @api {POST} /api/users Create user
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiParam {String{1..40}}                firstName           User first name.
 * @apiParam {String{1..80}}                lastName            User last name.
 * @apiParam {String{1..80}}                email               User email.
 * @apiParam {String{1..256}}               password            User password.
 *
 * @apiSuccess (Created 201) {Number}       id                  User unique identifier.
 * @apiSuccess (Created 201) {String}       userName            User username.
 * @apiSuccess (Created 201) {String}       firstName           User first name.
 * @apiSuccess (Created 201) {String}       lastName            User last name.
 * @apiSuccess (Created 201) {String}       email               User email.
 * @apiSuccess (Created 201) {Boolean}      confirmed           User has confirmed email.
 * @apiSuccess (Created 201) {Date}         createdAt           User createdAt timestamp, format: ISO-8601.
 * @apiSuccess (Created 201) {Date}         updatedAt           User updatedAt timestamp, format: ISO-8601.
 *
 * @apiUse BadRequestError
 * @apiUse WrongPasswordFormat
 * @apiUse ConflictError
 *
 */
router.post('/users', users.signUp)

/**
 * @api {PUT} /api/users/confirm Confirm user email address
 * @apiName ConfirmEmailAddress
 * @apiGroup Users
 *
 * @apiParam {String{1..256}}   token               Received token in confirm email.
 *
 * @apiSuccess {Number}         id                  User unique identifier.
 * @apiSuccess {String}         firstName           User first name.
 * @apiSuccess {String}         lastName            User last name.
 * @apiSuccess {String}         accessToken         Server issued access token.
 *
 * @apiUse BadRequestError
 * @apiUse ForbiddenError
 *
 */
router.put('/users/confirm', users.confirmEmail)

/**
 * @api {POST} /api/users/reset-password Initiates user password reset action
 * @apiName ResetPassword
 * @apiGroup Users
 *
 * @apiParam {String{1..80}}    email               Email address where to send reset password link.
 *
 * @apiUse BadRequestError
 * @apiUse NotFoundError
 * @apiUse UnauthorizedError
 *
 */
router.post('/users/reset-password', users.resetPassword)

/**
 * @api {PUT} /api/users/reset-password Updates user password with new password
 * @apiName UpdatePassword
 * @apiGroup Users
 *
 * @apiParam {String{1..256}}               token               Received token in reset password email.
 * @apiParam {String{1..256}}               password            New password to update
 *
 * @apiUse BadRequestError
 * @apiUse ForbiddenError
 * @apiUse WrongPasswordFormat
 * @apiUse UnauthorizedError
 *
 */
router.put('/users/reset-password', users.updatePassword)

router.get('/commodities', commodities.getAll)

router.get('/teams', teams.getAll)


module.exports = router
