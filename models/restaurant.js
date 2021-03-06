const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  restaurantId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  restaurantName: {
    type: sequelize.STRING(255),
    allowNull: false
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

const restaurant = db.define('Restaurant', schema, options);

restaurant.sync({ alter: true })
  .then(() => {
    logger.info('Restaurant Migration Made');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = restaurant;
