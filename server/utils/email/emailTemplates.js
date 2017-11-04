'use strict'

const userName = '<p style="margin-bottom:15px"><strong>--fullName--</strong>,</p>'
exports.RESET_PASSWORD = `
  ${userName}
  <p style="margin-bottom:15px">To reset your password, please click on this link: <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="--resetPasswordToken--" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">here</font></a></span>.</p>
  <p style="margin-bottom:15px">If you did not request a password reset, please contact <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="mailto:erhart.jiri@gmail.com" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">erhart.jiri@gmail.com</font></a></span> immediately.</p>
  `

exports.PASSWORD_CHANGED = `
  ${userName}
  <p style="margin-bottom:15px">Your password has been successfully updated!</p>
  <p style="margin-bottom:15px">If you did not reset your password, please contact <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="mailto:erhart.jiri@gmail.com" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">erhart.jiri@gmail.com</font></a></span> immediately.</p>
  `

exports.CONFIRM_EMAIL = `
  ${userName}
  <p style="margin-bottom:15px">Thank you for registering with Pikotrade! Please <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="--confirmEmailToken--" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">click here</font></a></span> to verify your email address.</p>
  <p style="margin-bottom:15px">You are one step closer to owning commercial real estate starting with as little as $500.</p>
  `

exports.CHANGE_EMAIL = `
  ${userName}
  <p style="margin-bottom:15px">Your login email has been updated to --email--! Please <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="--confirmEmailToken--" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">click here</font></a></span> to verify your email address.</p>
  <p style="margin-bottom:15px">If you did not make this change, please contact us immediately at <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="mailto:erhart.jiri@gmail.com" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">erhart.jiri@gmail.com</font></a></span>.</p>
  `

exports.CHANGE_EMAIL_NOTIFY_OLD_EMAIL = `
  ${userName}
  <p style="margin-bottom:15px">Your login email has been updated.</p>
  <p style="margin-bottom:15px">If you did not request this change, please contact <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="mailto:erhart.jiri@gmail.com" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">erhart.jiri@gmail.com</font></a></span> immediately.</p>
  `

exports.REGISTRATION_CREATED_BY_ADMIN = confirmAddress => {
  let text = `${userName}
  <p style="margin-bottom:15px">We created account for you on pikotrade.herokuapp.com!`
  if (confirmAddress) {
    text += ` You need confirm your email address <span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><a href="${confirmAddress}" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">here</font></a></span>.`
  }
  text += `
  </p><p style="margin-bottom:15px">You can login <a href="--loginLink--" style="color:#7d5dfb"><font color="#7d5dfb" sans="" style="“color:#7d5dfb;font-family:lucida" unicode="">here</font></a> using following credentials:</p>
  <p style="margin-left:15px;margin-bottom:15px">username: --email-- </p>
  <p style="margin-left:15px;margin-bottom:15px">password: --password-- </p>
  `
  return text
}

exports.ERROR = `
  <p style="margin-bottom:15px">--description--</p>
  <p style="margin-bottom:15px">--message--</p>`
