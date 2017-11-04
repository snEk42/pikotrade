'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    password: { type: DataTypes.STRING, field: 'password' },
    email: { type: DataTypes.STRING(80), unique: true, field: 'email' },
    firstName: { type: DataTypes.STRING(40), allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING(80), allowNull: false, field: 'last_name' },
    publicToken: { type: DataTypes.STRING, field: 'public_token' },
    passwordPublicToken: { type: DataTypes.STRING, field: 'password_public_token' },
    duplicateResetPasswordToken: { type: DataTypes.STRING, field: 'duplicate_reset_password_token' },
    confirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'confirmed' },
    passwordLastUpdatedAt: { type: DataTypes.DATE, defaultValue: new Date().toISOString(), field: 'password_last_updated_at' },
    lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at' },
  }, {
    classMethods: {
      associate(models) {
        User.hasMany(models.AccessToken, {
          as: 'accessTokens',
          foreignKey: { name: 'userId', field: 'user_id' },
          onDelete: 'RESTRICT',
        })
      },
    },
    tableName: 'Users',
  })
  return User
}
