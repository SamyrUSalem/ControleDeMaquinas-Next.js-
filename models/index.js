import dbConfig from '../config/db_config.json';
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

import Sequelize, { DataTypes } from 'sequelize';
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

const User = require('../lib/models/User')(sequelize, DataTypes);
db['User'] = User;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
