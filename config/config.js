const dbConfig = require('../config/db_config.json');
const env = process.env.NODE_ENV || 'development';

module.exports = dbConfig[env];
