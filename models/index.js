const dbConfig = require('../config/db_config.json');
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

const User = require('../lib/models/User')(sequelize, Sequelize.DataTypes);
db['User'] = User;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
