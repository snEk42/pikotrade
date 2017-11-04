'use strict'

module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    skolaId: { type: DataTypes.INTEGER(10).UNSIGNED, allowNull: false, primaryKey: true, autoIncrement: true, field: 'SKOLA_ID' },
    kod: { type: DataTypes.STRING(13), allowNull: false, field: 'KOD' },
    skNazov: { type: DataTypes.STRING(100), allowNull: true, field: 'SK_NAZOV' },
    pedagog: { type: DataTypes.STRING(60), allowNull: true, field: 'PEDAGOG' },
    email: { type: DataTypes.STRING(100), allowNull: true, field: 'EMAIL' },
    prednaska: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0', field: 'PREDNASKA' },
    hash: { type: DataTypes.CHAR(8), allowNull: true, field: 'hash' },
    mistoKonani: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'praha', field: 'MISTO_KONANI' },
    ovvpId: { type: DataTypes.STRING(15), allowNull: true, field: 'ovvp_id' },
    ovvpAllow: { type: DataTypes.INTEGER(1), allowNull: true, field: 'ovvp_allow' },
    address: { type: DataTypes.STRING(200), allowNull: true, field: 'address' },
    zip: { type: DataTypes.STRING(10), allowNull: true, field: 'zip' },
    city: { type: DataTypes.STRING(100), allowNull: true, field: 'city' },
    showSchoolForm: { type: DataTypes.INTEGER(1), allowNull: true, field: 'show_school_form' },
    state: { type: DataTypes.STRING(50), allowNull: true, field: 'state' },
    shortName: { type: DataTypes.STRING(100), allowNull: true, field: 'short_name' },
  }, {
    classMethods: {
      associate(models) {
        School.hasMany(models.Teacher, {
          as: 'teachers',
          foreignKey: { name: 'skolaId', field: 'sid' },
          onDelete: 'RESTRICT',
        })
        School.hasMany(models.Team, {
          as: 'teams',
          foreignKey: { name: 'skolaId', field: 'SKOLA_ID' },
          onDelete: 'RESTRICT',
        })
      },
    },
    timestamps: false,
    tableName: 'skoly',
  })
  return School
}
