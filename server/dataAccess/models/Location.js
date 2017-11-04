'use strict'

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    mistoKod: { type: DataTypes.STRING(10), allowNull: false, field: 'MISTO_KOD' },
    mistoNazev: { type: DataTypes.STRING(50), allowNull: false, field: 'MISTO_NAZEV' },
    povolena: { type: DataTypes.CHAR(1), allowNull: false, field: 'POVOLENA' },
    pocetTymu: { type: DataTypes.INTEGER(4), allowNull: false, field: 'POCET_TYMU' },
  }, {
    timestamps: false,
    tableName: 'misto_konani',
  })
  return Location
}
