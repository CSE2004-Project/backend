const Restaurant = require('../models/restaurant');
const RestaurantOwner = require('../models/restaurantOwner');
const UserAddress = require('../models/userAddress');
const FoodItem = require('../models/foodItems');
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

  static async addItem (userId, restaurantId, itemName, itemDescription, price) {
    try {
      const ownerVerify = await RestaurantOwner.findOne({ where: { restaurantId: restaurantId } });
      if (!ownerVerify) {
        return {
          error: true,
          message: 'No such restaurant found',
          code: 404
        };
      }
      if (ownerVerify.userId !== userId) {
        return {
          error: true,
          message: 'You do not own this restaurant',
          code: 401
        };
      }
      const item = {
        itemId: uuid4(),
        restaurantId: restaurantId,
        itemName: itemName,
        itemDescription: itemDescription,
        price: price
      };
      await FoodItem.create(item);
      return {
        error: false,
        message: 'Successfully added Item',
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

  static async fetchAllRestaurants (addressId) {
    try {
      const address = await UserAddress.findOne({ where: { addressId: addressId } });
      if (!address) {
        return {
          error: true,
          message: 'No such address exists',
          code: 404
        };
      }
      const city = address.city;
      // const restaurants = await Restaurant.findAll({ where: { city: city } });
      const restaurants = await Restaurant.findAll({});
      return {
        error: false,
        message: 'Restaurants Fetched',
        code: 200,
        restaurants: restaurants
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

  static async fetchItems (restaurantId) {
    try {
      const exists = await Restaurant.findOne({ where: { restaurantId: restaurantId }, include: [FoodItem] });
      if (!exists) {
        return {
          error: true,
          message: 'No such restaurant exists',
          code: 404
        };
      }
      const items = exists["FoodItems"];
      if (!items) {
        return {
          error: true,
          message: 'No items have been added',
          code: 404
        };
      }
      return {
        error: false,
        message: 'Multiple Items Have Been Fetched',
        code: 200,
        items: items
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

module.exports = RestaurantController;
