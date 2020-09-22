const User = require('../models/user');
const UserAddress = require('../models/userAddress');
// const Order = require('../models/orders');
// const OrderItem = require('../models/orderItems');
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
}

module.exports = UserController;
