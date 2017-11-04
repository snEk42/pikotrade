'use strict'

require('dotenv').load({ silent: true })

const db = require('../server/dataAccess')
const cryptoUtils = require('../server/utils/cryptoUtils')

const newUser = {
  firstName: 'Jiri',
  lastName: 'Erhart',
  email: 'erhart.jiri@gmail.com',
  password: 'Password123!',
  confirmed: true,
  publicToken: null,
}


function createUser(user) {
  return cryptoUtils.hashPassword(user.password).then(hashedPassword => {
    user.password = hashedPassword
    return db.User.create(user)
  })
}

createUser(newUser)

