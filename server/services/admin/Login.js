'use strict'

const AbstractService = require('./../abstract')
const adminRepository = require('./../../repositories/admin')
const appErrors = require('./../../utils/errors/app')
const cryptoUtils = require('./../../utils/cryptoUtils')
const tokenGenerator = require('./../../utils/tokenGenerator')

module.exports = class LoginService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        userName: { type: 'string', required: true, minimum: 1 },
        password: { type: 'string', required: true, minimum: 1 },
      },
    }
  }

  run() {
    const context = { admin: null }
    adminRepository.findByUserName(this.requestData.userName)
      .then(admin => {
        context.admin = admin
        return cryptoUtils.comparePasswords(this.requestData.password, context.admin.password)
      })
      .then(verified => {
        if (!verified || context.admin.disabled) {
          throw new appErrors.UnauthorizedError()
        }
        const accessToken = tokenGenerator.generateAdminJwtToken({
          userId: null,
          adminId: context.admin.id,
        })
        return this.done({
          id: context.admin.id,
          permissions: context.admin.permissions,
          userName: context.admin.userName,
          accessToken,
        })
      })
      .catch(err => this.error(err))
  }
}
