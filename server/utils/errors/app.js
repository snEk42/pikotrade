'use strict'

const logger = require('./../logger').errorLogger

class AppError extends Error {
  constructor(type) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.type = type
    const stack = this.stack ? this.stack.split('\n') : this.stack
    logger.error({
      error: {
        name: this.name,
        type,
        stack: stack && stack.length > 2 ? `${stack[0]}  ${stack[1]}` : stack,
      },
    })
  }
}

class ValidationError extends AppError {
  constructor(message, errors) {
    super('E_VALIDATION')
    this.message = message
    this.errors = errors
  }
}

class CannotBeDoneError extends AppError {
  constructor(message) {
    super('E_CANNOT_BE_DONE')
    this.message = message
  }
}

class AlreadyExistsError extends AppError {
  constructor() {
    super('E_EXISTS')
  }
}

class InvalidDataError extends AppError {
  constructor(message) {
    super('E_INVALID_DATA')
    this.message = message
  }
}

class InvalidTokenError extends AppError {
  constructor() {
    super('E_INVALID_TOKEN')
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super('E_UNAUTH')
  }
}
class TokenRevokedError extends AppError {
  constructor() {
    super('E_TOKEN_REVOKED')
  }
}

class TokenIdleTimoutError extends AppError {
  constructor() {
    super('E_TOKEN_IDLE_TIMEOUT')
  }
}

class NotFoundError extends AppError {
  constructor() {
    super('E_NOTFOUND')
  }
}

class InvalidStateError extends AppError {
  constructor() {
    super('E_INVALID_STATE')
  }
}

class NotConfirmedError extends AppError {
  constructor() {
    super('E_UNCONFIRMED')
  }
}

module.exports = {
  AppError,
  ValidationError,
  CannotBeDoneError,
  AlreadyExistsError,
  InvalidDataError,
  InvalidTokenError,
  UnauthorizedError,
  TokenRevokedError,
  TokenIdleTimoutError,
  NotFoundError,
  InvalidStateError,
  NotConfirmedError,
}
