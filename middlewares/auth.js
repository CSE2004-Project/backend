const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../logging/logger');

exports.isLoggedIn = (req, res, next) => {
  const tokenHeader = req.header('Authorization');
  if (!tokenHeader) {
    const response = {
      error: true,
      message: 'Access is denied',
      code: 401
    };
    return res.status(response.code).send(response);
  }
  try {
    const token = tokenHeader.split(' ');
    req.decoded = jwt.verify(token[1], process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    const response = {
      error: true,
      message: 'Token is invalid',
      code: 400
    };
    return res.status(response.code).send(response);
  }
};

exports.isCustomer = async (req, res, next) => {
  try {
    const details = await User.findOne({ where: { userId: req.decoded.userId } });
    if (!details) {
      const response = {
        error: true,
        message: 'This user does not exist',
        code: '404'
      };
      return res.status(response.code).send(response);
    }
    if (details.role !== 1) {
      const response = {
        error: true,
        message: 'Unauthorized Access: Not Allowed',
        code: '403'
      };
      return res.status(response.code).send(response);
    } else {
      next();
    }
  } catch (err) {
    logger.error('An error occurred' + err);
    const response = {
      error: true,
      message: 'An error occurred' + err,
      code: '404'
    };
    return res.status(response.code).send(response);
  }
};

exports.isOwner = async (req, res, next) => {
  try {
    const details = await User.findOne({ where: { userId: req.decoded.userId } });
    if (!details) {
      const response = {
        error: true,
        message: 'This user does not exist',
        code: '404'
      };
      return res.status(response.code).send(response);
    }
    if (details.role !== 2) {
      const response = {
        error: true,
        message: 'Unauthorized Access: Not Allowed',
        code: '403'
      };
      return res.status(response.code).send(response);
    } else {
      next();
    }
  } catch (err) {
    logger.error('An error occurred' + err);
    const response = {
      error: true,
      message: 'An error occurred' + err,
      code: '404'
    };
    return res.status(response.code).send(response);
  }
};

exports.isDeliveryBoy = async (req, res, next) => {
  try {
    const details = await User.findOne({ where: { userId: req.decoded.userId } });
    if (!details) {
      const response = {
        error: true,
        message: 'This user does not exist',
        code: '404'
      };
      return res.status(response.code).send(response);
    }
    if (details.role !== 3) {
      const response = {
        error: true,
        message: 'Unauthorized Access: Not Allowed',
        code: '403'
      };
      return res.status(response.code).send(response);
    } else {
      next();
    }
  } catch (err) {
    logger.error('An error occurred' + err);
    const response = {
      error: true,
      message: 'An error occurred' + err,
      code: '404'
    };
    return res.status(response.code).send(response);
  }
};
