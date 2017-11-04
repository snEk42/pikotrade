'use strict'

module.exports = (sequelize, DataTypes) => {
  const ExchangeRate = sequelize.define('ExchangeRate', {
    time: { type: DataTypes.DATE, field: 'time' },
    value: { type: DataTypes.DOUBLE, allowNull: false, field: 'value' },
    exchangeRate: { type: DataTypes.DOUBLE, allowNull: false, field: 'exchange_rate' },
  }, {
    classMethods: {
      associate(models) {
        ExchangeRate.belongsTo(models.Commodity, {
          as: 'comodity',
          foreignKey: { name: 'commodityId', field: 'commodity_id' },
          onDelete: 'RESTRICT',
        })
      },
    },
    tableName: 'ExchangeRates',
  })
  return ExchangeRate
}
