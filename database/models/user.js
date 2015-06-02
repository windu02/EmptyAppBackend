var connection = require('../connection.js');

exports.schema = connection.sequelize.define('User', {
  username: {type: connection.Sequelize.STRING, unique: true},
  email: {type: connection.Sequelize.STRING, unique: true},
  password: connection.Sequelize.STRING,
  token: connection.Sequelize.STRING(512),
  lastIp: connection.Sequelize.STRING
});