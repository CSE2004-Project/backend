const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  userId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  name: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  email: {
    type: sequelize.STRING(255),
    allowNull: false,
    isEmail: true
  },
  phoneNumber: {
    type: sequelize.STRING(12),
    allowNull: false
  },
  password: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  role: {
    type: sequelize.INTEGER(1),
    allowNull: false,
    isIn: [[1, 2, 3]],
    defaultValue: 1
  }
};

const options = {
  timestamps: false
};
const User = db.define('User', schema, options);

User.sync({ alter: true })
  .then(() => {
    logger.info('Table Created');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = User;
