const Restaurant = require('../models/restaurant');
const RestaurantOwner = require('../models/restaurantOwner');
const uuid4 = require('uuid4');
const logger = require('../logging/logger');

class RestaurantController {
    static async addRestaurant (userId, restaurantName, addressLine1, addressLine2, state, city, pinCode) {
        try {
            const restaurantQuery = {
                restaurantId: uuid4(),
                restaurantName: restaurantName,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                state: state,
                city: city,
                pinCode: pinCode
            };
            await Restaurant.create(restaurantQuery);
            const restOwnerQuery = {
                id: uuid4(),
                userId: userId,
                restaurantId: restaurantQuery.restaurantId
            };
            await RestaurantOwner.create(restOwnerQuery);
            return {
                error: false,
                message: 'Restaurant Created Successfully',
                code: 201
            };
        } catch (err) {
            logger.error('An error occurred' + err);
            return {
                error: true,
                message: 'An Error Occurred' + err,
                code: 500
            };
        }
    }
}

module.exports = RestaurantController