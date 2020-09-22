const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  orderItemId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  itemId: {
    type: sequelize.UUID,
    allowNull: true,
    references: {
      model: 'FoodItems',
      key: 'itemId'
    }
  },
  orderId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'orderId'
    }
  },
  quantity: {
    type: sequelize.INTEGER(2),
    allowNull: false
  }
};

const options = {
  timestamps: false
};

const orderItems = db.define('OrderItems', schema, options);

orderItems.sync({ alter: true })
  .then(() => {
    logger.info('Table Created');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = orderItems;
