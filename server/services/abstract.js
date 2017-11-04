'use strict'

const Promise = require('bluebird')
const shortId = require('shortid')
const { validate } = require('./../utils/validators')
const appErrors = require('./../utils/errors/app')
const { serviceLogger } = require('./../utils/logger')
const traverse = require('traverse')
const _ = require('lodash')

const sensitiveAttributes = ['password']

module.exports = class AbstractService {
  constructor(options) {
    this.uuid = shortId.generate()
    this.adminPermissions = options ? options.adminPermissions : null
  }

  execute(inputData) {
    this.startTime = Date.now()
    serviceLogger.info(`${this.uuid}(${this.constructor.name}) - START EXECUTING... with payload:${JSON.stringify(removeSensitiveAttributes(inputData, sensitiveAttributes))}`)
    return new Promise((resolve, reject) => {
      inputData = prepareInput(inputData)
      if (this.schema && typeof this.schema === 'function') {
        const schema = this.schema()
        if (typeof schema === 'object') {
          schema.additionalProperties = false
          const validationErrors = validate(inputData, schema).errors
          if (validationErrors.length > 0) {
            serviceLogger.info(validationErrors)
            this.rejected = true
            return reject(new appErrors.ValidationError('Invalid or missing request data.', validationErrors))
          }
          this.requestData = inputData
        } else {
          throw new Error('Method \'schema\' does not return an object')
        }
      }
      this.resolve = resolve
      this.reject = reject
      if (!this.run || typeof this.run !== 'function') {
        return reject(new Error('Method \'run\' is not implemented'))
      }
      return this.run()
    }).catch(err => {
      if (!this.rejected) {
        const errType = err.type ? err.type : 'UnknownError'
        serviceLogger.error(`${this.uuid}(${this.constructor.name}) - CATCH ERROR ${errType} (${Date.now() - this.startTime} ms)`)
      }
      throw err
    })
  }

  log(text) {
    serviceLogger.info(`${this.uuid}(${this.constructor.name}) - ${text}`)
  }

  done(data) {
    serviceLogger.info(`${this.uuid}(${this.constructor.name}) - DONE (${Date.now() - this.startTime} ms)`)
    this.resolve(data)
  }

  error(err) {
    serviceLogger.error(`${this.uuid}(${this.constructor.name}) - ERROR ${err.type ? err.type : 'UnknownError'} (${Date.now() - this.startTime} ms)`)
    this.rejected = true
    this.reject(err)
  }
}

function prepareInput(inputData) {
  traverse(inputData).forEach(function(value) {
    if (typeof value === 'string') {
      const trimed = value.trim()
      this.update(trimed || null)
    }
  })
  return inputData
}

function removeSensitiveAttributes(inputData, excludes) {
  if (!inputData || !excludes || excludes.length <= 0) {
    return inputData
  }
  const clonedData = _.cloneDeep(inputData)
  traverse(clonedData).forEach(function() {
    if (excludes.find(item => item === this.key)) {
      this.remove()
    }
  })
  return clonedData
}
