const express = require('express');
const compression = require('compression');

const morgan = require('./logging/morgan');
const routes = require('./routes');
const db = require('./database/connection');
const logger = require('./logging/logger');

const app = express();

// Middlewares
app.use(express.json());
app.use(compression());
require('dotenv').config();

// Database Connection Test
db.authenticate()
  .then(() => {
    logger.info('Connected To Database');
  })
  .catch(err => {
    logger.error('An error occurred' + err);
    process.exit(2);
  });

// Require All Models for migration
require('./models/foodItems');
require('./models/orderItems');
require('./models/orders');
require('./models/restaurant');
require('./models/restaurantOwner');
require('./models/user');
require('./models/userAddress');

// Logging
app.use(morgan);

// Import Routes
const userRoutes = require('./routes/user');

// Mount routes
app.use('/', routes);
app.use('/api/user', userRoutes);
module.exports = app;
