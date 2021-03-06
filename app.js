const express = require('express');
const compression = require('compression');

const morgan = require('./logging/morgan');
const routes = require('./routes');
const db = require('./database/connection');
const logger = require('./logging/logger');
const cors = require('cors');

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
require('./models/user');
require('./models/userAddress');
require('./models/restaurant');
require('./models/foodItems');
require('./models/restaurantOwner');
require('./models/orderItems');
require('./models/orders');
require('./models/relations');

// Logging
app.use(morgan);
app.use(cors());

// Import Routes
const userRoutes = require('./routes/user');
const restaurantRoutes = require('./routes/restaurant');

// Mount routes
app.use('/', routes);
app.use('/api/user', userRoutes);
app.use('/api/restaurant', restaurantRoutes);

module.exports = app;
