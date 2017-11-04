'use strict'

exports.userForLogin = userForLogin
exports.clearSensitiveUserData = clearSensitiveUserData

function userForLogin(user) {
  if (!user) {
    throw new Error('User is empty in response parsing')
  }
  const parsedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accessToken: user.accessToken,
    confirmed: user.confirmed,
  }

  return parsedUser
}

function clearSensitiveUserData(user) {
  if (!user) {
    return user
  }

  delete user.password
  delete user.publicToken
  delete user.passwordPublicToken
  delete user.duplicateResetPasswordTokenpasswordPublicToken
  delete user.confirmed
  delete user.passwordLastUpdatedAt
  delete user.lastLoginAt

  return user
}
