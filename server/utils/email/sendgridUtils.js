'use strict'

const config = require('config')
const _ = require('lodash')
const logger = require('./../logger').errorLogger
const emailTemplates = require('./emailTemplates')

const sendgridConfig = config.get('sendgrid')
const sendgridClient = require('sendgrid')(sendgridConfig.apiKey)
const sendgridHelper = require('sendgrid').mail


sendgridHelper.Mail.prototype.addSubstitution = (placeHolder, value) => {
  const substitution = new sendgridHelper.Substitution(placeHolder, value ? value.toString() : '')
  this.personalizations[0].addSubstitution(substitution)
}
sendgridHelper.Mail.prototype.addTo = toAddress => {
  if (toAddress instanceof Array) {
    toAddress.forEach(item => this.personalizations[0].addTo(new sendgridHelper.Email(item)))
  } else {
    this.personalizations[0].addTo(new sendgridHelper.Email(toAddress))
  }
}

exports.sendInviteEmail = data => {
  if (!data || !data.fullName || !data.confirmToken || !config.hostname) {
    throw new Error('Expected parameters: \'data\', \'fullName\', \'confirmToken\', \'hostname\'.')
  }
  const email = basicTemplate('Complete your registration', sendgridConfig.infoAddress, data.toAddress, emailTemplates.CONFIRM_EMAIL, sendgridConfig.fromName)
  email.addSubstitution('--fullName--', data.fullName)
  email.addSubstitution('--confirmEmailToken--', `${config.hostname}auth/confirm-registration/${data.confirmToken}`)
  return sendEmailAsync(email)
}
exports.sendChangeLoginEmail = data => {
  if (!data || !data.fullName || !data.confirmToken || !config.hostname) {
    throw new Error('Expected parameters: \'data\', \'fullName\', \'confirmToken\', \'hostname\'.')
  }
  const email = basicTemplate('Your login email has been changed', sendgridConfig.infoAddress, data.toAddress, emailTemplates.CHANGE_EMAIL, sendgridConfig.fromName)
  email.addSubstitution('--email--', data.toAddress)
  email.addSubstitution('--fullName--', data.fullName)
  email.addSubstitution('--confirmEmailToken--', `${config.hostname}auth/confirm-registration/${data.confirmToken}`)
  return sendEmailAsync(email)
}
exports.sendChangeLoginToOldEmail = data => {
  if (!data || !data.fullName || !config.hostname) {
    throw new Error('Expected parameters: \'data\', \'fullName\', \'confirmToken\', \'hostname\'.')
  }
  const email = basicTemplate('Your login email has been updated', sendgridConfig.infoAddress, data.toAddress, emailTemplates.CHANGE_EMAIL_NOTIFY_OLD_EMAIL, sendgridConfig.fromName)
  email.addSubstitution('--email--', data.toAddress)
  email.addSubstitution('--fullName--', data.fullName)
  return sendEmailAsync(email)
}
exports.sendResetPasswordEmail = data => {
  if (!data || !data.toAddress || !data.resetPasswordToken || !data.fullName || !config.hostname) {
    throw new Error('Expected parameters: \'data\',\'toAddress\',\'resetPasswordToken\',\'fullName\', \'hostname\'.')
  }
  const email = basicTemplate('Reset your password', sendgridConfig.infoAddress, data.toAddress, emailTemplates.RESET_PASSWORD, sendgridConfig.fromName)
  email.addSubstitution('--resetPasswordToken--', `${config.hostname}auth/reset-password/${data.resetPasswordToken}`)
  email.addSubstitution('--fullName--', data.fullName)
  return sendEmailAsync(email)
}
exports.sendChangePasswordEmail = data => {
  if (!data || !data.toAddress || !data.fullName) {
    throw new Error('Expected parameters: \'data\', \'toAddress\', \'fullName\'.')
  }
  const email = basicTemplate('Your password has been updated', sendgridConfig.infoAddress, data.toAddress, emailTemplates.PASSWORD_CHANGED, sendgridConfig.fromName)
  email.addSubstitution('--fullName--', data.fullName)
  return sendEmailAsync(email)
}
exports.sendCreatedByAdmin = data => {
  if (!data || !data.email || !data.fullName || !data.password) {
    throw new Error('Missing data while sending invitation email')
  }
  const email = basicTemplate('Welcome to Pikotrade', sendgridConfig.fromAddress, data.email, emailTemplates.REGISTRATION_CREATED_BY_ADMIN(data.confirmToken ? `${config.hostname}auth/confirm-registration/${data.confirmToken}` : null))
  email.addSubstitution('--fullName--', data.fullName)
  email.addSubstitution('--loginLink--', `${config.hostname}auth/login`)
  email.addSubstitution('--email--', data.email)
  email.addSubstitution('--password--', data.password)
  return sendEmailAsync(email)
}
exports.sendDeveloperErrorEmail = data => {
  if (!data || !data.description || !data.message) {
    throw new Error('Missing data while sending error email')
  }
  const email = basicTemplate('Error', sendgridConfig.fromAddress, sendgridConfig.developerRecipient, emailTemplates.ERROR)
  email.addSubstitution('--description--', data.description)
  email.addSubstitution('--message--', data.message)
  return sendEmailAsync(email)
}
exports.sendErrorEmail = data => {
  if (!data || !data.description || !data.message) {
    throw new Error('Missing data while sending error email')
  }
  const email = basicTemplate('Error', sendgridConfig.fromAddress, sendgridConfig.defaultUserRecipient, emailTemplates.ERROR)
  email.addSubstitution('--description--', data.description)
  email.addSubstitution('--message--', data.message)
  return sendEmailAsync(email)
}

function basicTemplate(subject, fromAddress, toAddress, template, fromName) {
  let senderFromName = ''
  if (sendgridConfig.environment) {
    senderFromName = fromName ? `${fromName} ${sendgridConfig.environment}` : sendgridConfig.environment
  } else {
    senderFromName = fromName || sendgridConfig.defaultFromName
  }

  const fromEmail = new sendgridHelper.Email(fromAddress, senderFromName)
  const toEmail = new sendgridHelper.Email(toAddress)
  const content = new sendgridHelper.Content('text/html', template)
  const mail = new sendgridHelper.Mail(fromEmail, subject, toEmail, content)
  mail.setTemplateId(sendgridConfig.genericEmailTemplateId)
  return mail
}

function sendEmailAsync(email) {
  let emailHost = null
  let defaultRecipientForce = false
  const developmentExceptions = []

  const getEmailHost = toEmail => toEmail.split('@')[1] ? toEmail.split('@')[1].toLowerCase() : toEmail.split('@')[1]
  email.getPersonalizations().forEach(item => {
    item.tos && item.tos.forEach(toEmail => {
      if (toEmail.email) {
        emailHost = getEmailHost(toEmail.email)
        if (developmentExceptions.indexOf(emailHost) < 0 && sendgridConfig.defaultUserRecipient) {
          defaultRecipientForce = true
        }
      }
    })
  })

  if (defaultRecipientForce) {
    email.getPersonalizations().forEach(item => {
      item.tos && item.tos.forEach(toEmail => {
        if (toEmail.email) {
          toEmail.email = sendgridConfig.defaultUserRecipient
        }
      })
    })
  }

  email.getPersonalizations().forEach(item => {
    item.tos = _.uniqBy(item.tos, 'email')
  })

  email.getPersonalizations().forEach(item => {
    item.tos && item.tos.forEach(toEmail => {
      if (toEmail.email) {
        console.log(`Sending an EMAIL to ${toEmail.email}`)
      }
    })
  })
  const request = sendgridClient.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = email.toJSON()
  return sendgridClient.API(request)
    .catch(err => {
      console.log('Error sending email', email)
      if (err && err.response) {
        console.log('Error body', err.response.body)
      }
      console.log(err)
      logger.error(err)
      throw err
    })
}
