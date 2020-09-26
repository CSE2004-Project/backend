const User = require('../models/user');
const UserAddress = require('../models/userAddress');
const Order = require('../models/orders');
const OrderItem = require('../models/orderItems');
const Restaurant = require('../models/restaurant');
// const FoodItem = require('../models/foodItems');
const bcrypt = require('bcryptjs');
const uuid4 = require('uuid4');
const logger = require('../logging/logger');
const jwt = require('jsonwebtoken');

class UserController {
  static async register (name, email, phone, pass, role) {
    try {
      const emailExists = await User.findOne({
        where: {
          email
        }
      });
      if (emailExists) {
        return {
          error: true,
          message: 'An account with this email already exists',
          code: 409
        };
      }
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      const password = await bcrypt.hash(pass, salt);
      const user = {
        userId: uuid4(),
        name: name,
        email: email,
        phoneNumber: phone,
        password: password,
        role: role
      };
      await User.create(user);
      return {
        error: false,
        message: 'Your Account Has Been Created Successfully',
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

  static async login (email, password) {
    try {
      const filter = {
        where: {
          email
        }
      };
      const exists = await User.findOne(filter);
      if (!exists) {
        return {
          error: true,
          message: 'No such user exists',
          code: 404
        };
      }
      const pass = await bcrypt.compare(password, exists.password);
      if (!pass) {
        return {
          error: true,
          message: 'Incorrect Password',
          code: 401
        };
      }
      const token = jwt.sign({ userId: exists.userId }, process.env.TOKEN_SECRET);
      return {
        error: false,
        message: 'Login Successful',
        code: 200,
        JWT: token,
        userDetails: exists
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

  static async addAddress (userId, addressLine1, addressLine2, state, city, pinCode) {
    try {
      const filter = {
        where: {
          userId
        }
      };
      const exists = await User.findOne(filter);
      if (!exists) {
        return {
          error: true,
          message: 'This user does not exist',
          code: '404'
        };
      }
      const userAddress = {
        userId: userId,
        addressId: uuid4(),
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        state: state,
        city: city,
        pinCode: pinCode
      };
      await UserAddress.create(userAddress);
      return {
        error: false,
        message: 'Your address has been added successfully',
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

  static async fetchDetails (userId) {
    try {
      const exist = await User.findOne({ where: { userId: userId }, include: [{ all: true }] });
      if (!exist) {
        return {
          error: true,
          message: 'No such user found',
          code: 404
        };
      }
      return {
        error: false,
        message: 'User found',
        code: 200,
        userDetails: exist
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

  static async fetchAddresses (userId) {
    try {
      const exist = await UserAddress.findAll({ where: { userId } });
      if (!exist) {
        return {
          error: true,
          message: 'No addresses found',
          code: 404
        };
      }
      return {
        error: false,
        message: 'Addresses for user found',
        code: 200,
        userAddresses: exist
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

  static async updateDetails (userId, name, email, phone) {
    try {
      const filter = { where: { userId } };
      const exist = await User.findOne();
      if (!exist) {
        return {
          error: true,
          message: 'No such user found',
          code: 404
        };
      }
      const query = {
        name: name,
        email: email,
        phone: phone
      };
      await User.update(query, filter);
      return {
        error: false,
        message: 'The details have been successfully updated',
        code: 200
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

  static async placeOrder (userId, addressId, restaurantId, orderItems, total) {
    try {
      const deliveryBoys = await User.findAll({ where: { role: 3 } });
      const selectedBoy = Math.floor((Math.random() * (deliveryBoys.length - 1)));
      const order = {
        orderId: uuid4(),
        userId: userId,
        restaurantId: restaurantId,
        addressId: addressId,
        deliveryBoyId: deliveryBoys[selectedBoy].userId,
        total: total
      };
      await Order.create(order);
      const items = [];
      for (const i of orderItems) {
        const obj = {
          orderItemId: uuid4(),
          orderId: order.orderId,
          itemId: i.itemId,
          quantity: i.quantity
        };
        items.push(obj);
      }
      await OrderItem.bulkCreate(items, { validate: true });
      return {
        error: false,
        message: 'Order Placed Successfully',
        code: 201,
        orderId: order.orderId
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

  static async deliverOrder (userId, orderId) {
    try {
      const filter = {
        where: {
          orderId
        }
      };
      const order = await Order.findOne(filter);
      if (!order) {
        return {
          error: true,
          message: 'No such order found',
          code: 404
        };
      }
      if (order.deliveryBoyId !== userId) {
        return {
          error: true,
          message: 'You are not assigned to deliver this order',
          code: 401
        };
      }
      if (order.orderStatus === 'Delivered') {
        return {
          error: true,
          message: 'This order is already delivered',
          code: 409
        };
      }
      const query = {
        orderStatus: 'Delivered'
      };
      await Order.update(query, filter);
      return {
        error: false,
        message: 'Order Successfully Delivered',
        code: 200
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

  static async fetchOrders (userId) {
    try {
      const filter = {
        where: {
          userId
        },
        include: [UserAddress, OrderItem, Restaurant]
      };
      const orders = await Order.findAll(filter);
      if (orders.length === 0) {
        return {
          error: false,
          message: 'You have not placed any orders yet',
          code: 200
        };
      }
      return {
        error: false,
        message: 'Orders have been retrieved successfully',
        code: 200,
        orders: orders
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

  static async fetchOrderDetails (userId, orderId) {
    try {
      const orderFilter = {
        where: {
          orderId
        },
        include: [{ all: true }]
      };
      const order = await Order.findOne(orderFilter);
      if(order.userId!==userId){
        return {
          error: true,
          message: 'The given order was not placed by you',
          code: 401
        }
      }
      return {
        error: false,
        message: 'Order Details Fetched',
        code: 200,
        orderDetails: order
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

module.exports = UserController;
