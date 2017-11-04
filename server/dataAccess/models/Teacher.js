'use strict'

module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    tid: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true, autoIncrement: true, field: 'tid' },
    // sid: { type: DataTypes.INTEGER(10), allowNull: false, field: 'sid' },
    name: { type: DataTypes.STRING(100), allowNull: false, field: 'name' },
    email: { type: DataTypes.STRING(100), allowNull: false, field: 'email' },
    ovvpAllow: { type: DataTypes.INTEGER(1), allowNull: false, field: 'ovvp_allow' },
    phone: { type: DataTypes.STRING(100), allowNull: false, field: 'phone' },
  }, {
    classMethods: {
      associate(models) {
        Teacher.belongsTo(models.School, {
          as: 'school',
          foreignKey: { name: 'skolaId', field: 'sid' },
          onDelete: 'RESTRICT',
        })
      },
    },
    timestamps: false,
    tableName: 'teachers',
  })
  return Teacher
}
