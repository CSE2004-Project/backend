const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  itemId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  restaurantId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Restaurants',
      key: 'restaurantId'
    }
  },
  itemName: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  itemDescription: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  price: {
    type: sequelize.INTEGER(5),
    allowNull: false
  }
};

const options = {
  timestamps: false
};

const foodItems = db.define('FoodItems', schema, options);

foodItems.sync({ alter: true })
  .then(() => {
    logger.info('Table Created');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = foodItems;
