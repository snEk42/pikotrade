'use strict'

module.exports = (sequelize, DataTypes) => {
  const Commodity = sequelize.define('Commodity', {
    name: { type: DataTypes.STRING, field: 'name' },
    median: { type: DataTypes.DOUBLE, allowNull: false, field: 'median' },
  }, {
    classMethods: {
      associate(models) {
        Commodity.hasMany(models.ExchangeRate, {
          as: 'exchangeRates',
          foreignKey: { name: 'commodityId', field: 'commodity_id' },
          onDelete: 'RESTRICT',
        })
      },
    },
    tableName: 'Commodities',
  })
  return Commodity
}
