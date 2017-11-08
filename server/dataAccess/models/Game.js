'use strict'

module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    start: { type: DataTypes.DATE, allowNull: false, field: 'start' },
    end: { type: DataTypes.DATE, allowNull: false, field: 'end' },
  }, {
    tableName: 'Games',
  })
  return Game
}
