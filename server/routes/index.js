'use strict'

const { Router } = require('express')
const publicRoutes = require('./public')
const authenticatedRoutes = require('./authenticated')
const errorsHandler = require('./../handlers/errors')
const responseErrors = require('./../utils/errors/response')
const passportHandler = require('./../handlers/passport')
const config = require('config')

const router = new Router()
const apiRouter = new Router()

// Force redirect http requests to https
if (process.env.NODE_ENV === 'production') {
  apiRouter.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return next(new responseErrors.ForbiddenError('SSL is required.'))
    }
    return next()
  })
}

apiRouter.use((req, res, next) => {
  if (req.headers['api-version'] && req.headers['api-version'] !== config.apiVersion) {
    return res.status(409).json({ reloadBundleRequired: true })
  }
  return next()
})

// Public routes
apiRouter.use(publicRoutes)
apiRouter.use('/auth', passportHandler.authenticateUser, authenticatedRoutes)

// Error handling
apiRouter.use(errorsHandler.handleNotFound)
apiRouter.use(errorsHandler.handleErrors)

router.use('/api', apiRouter)

module.exports = router
