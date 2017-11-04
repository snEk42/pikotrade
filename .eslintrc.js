'use strict'

module.exports = {
  extends: [
    '@strv/javascript/environments/nodejs/v8',
    '@strv/javascript/environments/nodejs/optional',
    '@strv/javascript/coding-styles/recommended',
  ],
  rules: {
    'id-length': [1, {
      min: 2,
      max: 30,
      exceptions: [
        'i',
        '_',
      ],
    }],
  }
}