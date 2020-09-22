const sequelize = require('sequelize')
const db = require('../database/connection')
const logger = require('../logging/logger')

const schema = {
    userId: {
        type: sequelize.UUID,
        allowNull: false
    },
    restaurantId: {
        type: sequelize.UUID,
        allowNull: false
    }
}

const options = {
    timestamps: false
}

const restaurantOwner = db.define('RestaurantOwner', schema, options)

restaurantOwner.sync({alter: true})
    .then(() => {
        logger.info("Table Created")
    })
    .catch(err => {
        logger.error("An Error Occurred:" + err)
    });

module.exports = restaurantOwner;