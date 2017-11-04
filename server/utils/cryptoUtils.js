'use strict'

const bcrypt = require('bcrypt')
const Promise = require('bluebird')
const _ = require('lodash')

Promise.promisifyAll(bcrypt)

const hashPassword = password => bcrypt.hashAsync(password, 10)
const hashPasswordSync = password => bcrypt.hashSync(password, 10)

const generate = (possible, length) => {
  let len = length
  if (!length || typeof length !== 'number') {
    len = 15
  }
  let text = ''
  _.times(len, () => {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  })
  return text
}

const generateRandomPassword = () => {
  // Characters and Numbers which are not simmilar to each other
  const possible = 'abcdefghkmnprstuvxABCDEFGHKMNPRSTUVX23456789'
  const password = generate(possible, 8)
  return bcrypt.hashAsync(password, 10)
    .then(hash => ({ password, hash }))
}

const comparePasswords = (password1, password2) => bcrypt.compareAsync(password1, password2)


module.exports = {
  hashPassword,
  hashPasswordSync,
  comparePasswords,
  generateRandomPassword,
}
