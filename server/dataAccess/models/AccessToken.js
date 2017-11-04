'use strict'

module.exports = (sequelize, DataTypes) => {
  const AccessToken = sequelize.define('AccessToken', {
    token: { type: DataTypes.STRING, allowNull: false, field: 'token', unique: true },
    issuedAt: { type: DataTypes.DATE, field: 'issued_at' },
    expiresAt: { type: DataTypes.DATE, field: 'expires_at' },
    lastActivityAt: { type: DataTypes.DATE, field: 'last_activity_at' },
  }, {
    classMethods: {
      associate(models) {
        AccessToken.belongsTo(models.User, {
          as: 'user',
          foreignKey: { name: 'userId', field: 'user_id' },
          onDelete: 'RESTRICT',
        })
      },
    },
    tableName: 'Access_tokens',
  })
  return AccessToken
}
