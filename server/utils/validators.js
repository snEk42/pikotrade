'use strict'

const jsonschema = require('jsonschema')
const appErrors = require('./errors/app')

/**
 * Validates email address according to W3C standard.
 * Refer to: https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 * @type {Object}
 */
const emailValidator = options => {
  if (!options) {
    options = {}
  }
  if (!options.type) {
    options.type = ['string', 'null']
  }
  options.minLength = 1
  options.maxLength = 80
  options.pattern = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
  return options
}

const passwordValidator = options => {
  if (!options) {
    options = {}
  }
  options.type = 'string'
  options.minLength = 8
  options.maxLength = 256
  return options
}

const advancePasswordValidation = value => {
  const lowerCasePatt = new RegExp(/^(?=.*[a-z]).+$/)
  const upperCasePatt = new RegExp(/^(?=.*[A-Z]).+$/)
  const digitPatt = new RegExp(/^(?=.*\d).+$/)
  const specialPatt = new RegExp(/^(?=.*[_\W]).+$/)

  if (!(lowerCasePatt.test(value) && upperCasePatt.test(value))
    || !(digitPatt.test(value) || specialPatt.test(value))
    || (value.length < 8)
  ) {
    throw new appErrors.PasswordWrongFormat()
  }
}

const validate = (inputData, schema) => {
  const validator = new jsonschema.Validator()
  return validator.validate(inputData, schema)
}

module.exports = {
  emailValidator,
  passwordValidator,
  advancePasswordValidation,
  validate,
}
