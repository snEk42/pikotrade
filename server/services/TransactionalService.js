'use strict'

const Promise = require('bluebird')
const AbstractService = require('./abstract')
const logger = require('./../utils/logger').serviceLogger
const db = require('./../dataAccess')

module.exports = class TransactionalService extends AbstractService {
  constructor(options) {
    super(options)
    if ((options instanceof TransactionalService || options instanceof Object) && options.transaction) {
      this.setTransactionOwnerToParentService(options)
    } else {
      this.setTransactionOwnerToThisService()
      console.log(`Missing options when creating transactional service UUID: ${this.uuid}`)
    }
  }

  setTransactionOwnerToParentService(instanceOrOption) {
    this.transaction = instanceOrOption.transaction
    this.transactionHandled = false
    this.isOwnerOfTransacion = false
  }

  setTransactionOwnerToThisService() {
    this.transactionHandled = true
    this.isOwnerOfTransacion = true
  }

  commit() {
    if (!this.transactionHandled && this.isOwnerOfTransacion === true) {
      this.transactionHandled = true
      logger.info(`${this.uuid}(${this.constructor.name}) - TRANSACTION COMMITTED...`)
      return this.transaction.commit()
    }
    return Promise.resolve()
  }

  rollback() {
    if (!this.transactionHandled && this.isOwnerOfTransacion === true) {
      this.transactionHandled = true
      logger.info(`${this.uuid}(${this.constructor.name}) - TRANSACTION ROLLED BACK...`)
      return this.transaction.rollback()
    }
    return Promise.resolve()
  }

  createOrGetTransaction() {
    if (this.transaction) {
      logger.info(`${this.uuid}(${this.constructor.name}) - EXISTING TRANSACTION RETURNED...`)
      return Promise.resolve(this.transaction)
    }
    logger.info(`${this.uuid}(${this.constructor.name}) - TRANSACTION CREATED...`)
    this.transactionHandled = false
    return db.sequelize.transaction({
      autocommit: false,
      isolationLevel: db.sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    })
      .then(transaction => {
        this.transaction = transaction
        return transaction
      })
      .catch(err => this.error(err))
  }

  getExistingTransaction() {
    if (!this.transaction) {
      throw new Error('Method \'getExistingTransaction\' can be called only after \'createOrGetTransaction\' ')
    }
    return this.transaction
  }

  done(data) {
    return this.commit()
      .then(() => super.done(data))
  }

  error(err) {
    return this.rollback()
      .then(() => super.error(err))
  }
}
