const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  userId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userId'
    }
  },
  addressId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  addressLine1: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  addressLine2: {
    type: sequelize.STRING(255),
    allowNull: true
  },
  state: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  city: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  pinCode: {
    type: sequelize.INTEGER,
    allowNull: false
  }
};

const options = {
  timestamps: false
};

const userAddress = db.define('UserAddress', schema, options);

userAddress.sync({ alter: true })
  .then(() => {
    logger.info('UserAddress Migration Made');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = userAddress;
