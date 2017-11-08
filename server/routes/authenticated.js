'use strict'

const { Router } = require('express')
const users = require('../handlers/authenticated/users')
const teams = require('../handlers/authenticated/teams')
const commodities = require('../handlers/authenticated/commodities')

const router = new Router()

/**
 * @api {get} /api/auth/users/me/personal-info          Get users personal info
 * @apiName GetPersonalInfo
 * @apiGroup Users
 *
 * @apiHeader {String}          Authorization           Format: JWT ${access_token}
 *
 * @apiSuccess {String{1..40}}    firstName               User first name.
 * @apiSuccess {String{1..80}}    lastName                User last name.
 *
 * @apiUse  BadRequestError
 * @apiUse  NotFoundError
 *
 */
router.get('/users/me/personal-info', users.getPersonalInfo)

/**
 * @api {put} /api/auth/users/me/password     Updates user password in settings.
 * @apiName UpdateUserPasswordInSettings
 * @apiGroup Users
 *
 * @apiHeader {String}  Authorization  Format: JWT ${access_token}
 *
 * @apiParam {String{8..256}}   oldPassword             Old password validated with existing in db.
 * @apiParam {String{8..256}}   newPassword             New password for user.
 *
 * @apiParam {String}           accessToken             The access_token of authorized user.
 *
 * @apiUse NotFoundError
 * @apiUse WrongPasswordFormat
 *
 */
router.put('/users/me/password', users.updatePasswordAuthenticated)

/**
 * @api {put} /api/auth/users/me/personal-info          Updates user personal info
 * @apiName UpdatePersonalInfo
 * @apiGroup Users
 *
 * @apiHeader {String}          Authorization           Format: JWT ${access_token}
 *
 * @apiParam {String{1..40}}    firstName               User first name.
 * @apiParam {String{1..80}}    lastName                User last name.
 *
 * @apiUse  BadRequestError
 * @apiUse  NotFoundError
 *
 */
router.put('/users/me/personal-info', users.updatePersonalInfo)

router.put('/commodities/sell', commodities.sell)

router.put('/teams/increment-score', teams.incrementScore)

module.exports = router
