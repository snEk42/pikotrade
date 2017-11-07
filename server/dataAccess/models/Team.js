'use strict'

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    id: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true, field: 'DR_ID' },
    // skolaId: { type: DataTypes.INTEGER(11), allowNull: false, defaultValue: '0', field: 'SKOLA_ID' },
    name: { type: DataTypes.STRING(30), allowNull: true, field: 'DR_NAZOV' },
    cas: { type: DataTypes.DATE, allowNull: true, field: 'cas' },
    mp1: { type: DataTypes.STRING(30), allowNull: true, field: 'MP1' },
    t1: { type: DataTypes.INTEGER(11), allowNull: true, field: 'T1' },
    mp2: { type: DataTypes.STRING(30), allowNull: true, field: 'MP2' },
    t2: { type: DataTypes.INTEGER(11), allowNull: true, field: 'T2' },
    mp3: { type: DataTypes.STRING(30), allowNull: true, field: 'MP3' },
    t3: { type: DataTypes.INTEGER(11), allowNull: true, field: 'T3' },
    mp4: { type: DataTypes.STRING(30), allowNull: true, field: 'MP4' },
    t4: { type: DataTypes.INTEGER(11), allowNull: true, field: 'T4' },
    score: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: '0', field: 'dr_body' },
    room: { type: DataTypes.STRING(20), allowNull: true, field: 'mistnost' },
    site: { type: DataTypes.STRING(20), allowNull: true, field: 'site' },
    body2: { type: DataTypes.INTEGER(32), allowNull: true, field: 'body2' },
    arrived: { type: DataTypes.INTEGER(1), allowNull: true, defaultValue: '0', field: 'prisli' },
  }, {
    classMethods: {
      associate(models) {
        Team.belongsTo(models.School, {
          as: 'school',
          foreignKey: { name: 'skolaId', field: 'SKOLA_ID' },
          onDelete: 'RESTRICT',
        })
      },
    },
    timestamps: false,
    tableName: 'druzstva',
  })
  return Team
}
