const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  orderId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  orderTime: {
    type: sequelize.TIME,
    allowNull: false
  },
  addressId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'UserAddresses',
      key: 'addressId'
    }
  },
  orderDate: {
    type: sequelize.DATE,
    allowNull: false
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
  },
  orderStatus: {
    type: sequelize.STRING(255),
    isIn: [['Pending', 'Delivered']]
  },
  deliveryBoyId: {
    type: sequelize.UUID,
    allowNull: false
  }
};

const options = {
  timestamps: false
};

const order = db.define('Order', schema, options);

order.sync({ alter: true })
  .then(() => {
    logger.info('Table Created');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = order;
