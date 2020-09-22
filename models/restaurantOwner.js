const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  id: {
    type: sequelize.UUID,
    primaryKey: true
  },
  userId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userId'
    }
  },
  restaurantId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Restaurants',
      key: 'restaurantId'
    }
  }
};

const options = {
  timestamps: false
};

const restaurantOwner = db.define('RestaurantOwner', schema, options);

restaurantOwner.sync({ alter: true })
  .then(() => {
    logger.info('RestaurantOwner Migrations Done');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = restaurantOwner;
