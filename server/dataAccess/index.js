const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('config');

const dbConfig = config.get('db');
const sequelize = new Sequelize(dbConfig.url, dbConfig.options);
const db = {};

fs
  .readdirSync(path.join(__dirname + '/models'))
  .filter((file) => file.indexOf('.') !== 0)
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, '/models', file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;

module.exports = db;
